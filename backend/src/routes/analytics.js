// filepath: /home/sambit/Documents/portfolio-main/backend/src/routes/analytics.js
import express from 'express';
import { Analytics, VisitorSession, Contact, Project, Image } from '../models/index.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Middleware to extract client info
const extractClientInfo = (req) => {
  const userAgent = req.get('User-Agent') || '';
  const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  const referrer = req.get('Referrer') || req.get('Referer') || '';
  
  // Simple device detection
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  const isTablet = /iPad|Tablet/.test(userAgent);
  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  
  return {
    userAgent,
    ipAddress,
    referrer,
    deviceType
  };
};

// Generate session ID
const generateSessionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Track analytics event (public route)
router.post('/track', async (req, res) => {
  try {
    const { type, page, projectId, imageId, skillId, sessionId, duration, clickPosition } = req.body;
    const clientInfo = extractClientInfo(req);
    
    // Create or update visitor session
    let session = null;
    if (sessionId) {
      session = await VisitorSession.findOne({ sessionId });
      if (session) {
        session.lastActivity = new Date();
        session.pageViews += 1;
        await session.save();
      }
    }
    
    if (!session && type === 'page_view') {
      const newSessionId = generateSessionId();
      session = new VisitorSession({
        sessionId: newSessionId,
        ...clientInfo,
        deviceInfo: {
          type: clientInfo.deviceType,
          browser: clientInfo.userAgent.split(' ')[0] || 'Unknown',
          os: clientInfo.userAgent.includes('Windows') ? 'Windows' : 
              clientInfo.userAgent.includes('Mac') ? 'Mac' : 
              clientInfo.userAgent.includes('Linux') ? 'Linux' : 'Unknown',
          device: clientInfo.deviceType
        }
      });
      await session.save();
    }
    
    // Create analytics event
    const analyticsEvent = new Analytics({
      type,
      page,
      projectId: projectId || null,
      imageId: imageId || null,
      skillId: skillId || null,
      metadata: {
        ...clientInfo,
        sessionId: session?.sessionId || sessionId,
        duration: duration || null,
        clickPosition: clickPosition || null
      }
    });
    
    await analyticsEvent.save();
    
    res.json({ 
      success: true, 
      sessionId: session?.sessionId || sessionId,
      message: 'Analytics event tracked successfully' 
    });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    res.status(500).json({ message: 'Failed to track analytics event' });
  }
});

// Get dashboard analytics (admin only)
router.get('/dashboard', adminMiddleware, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    // Get analytics data
    const [
      totalViews,
      uniqueVisitors,
      projectClicks,
      contactSubmissions,
      pageViews,
      topProjects,
      deviceStats,
      dailyStats,
      recentContacts,
      bounceRate
    ] = await Promise.all([
      // Total views
      Analytics.countDocuments({
        type: 'page_view',
        createdAt: { $gte: startDate }
      }),
      
      // Unique visitors
      VisitorSession.countDocuments({
        createdAt: { $gte: startDate }
      }),
      
      // Project clicks
      Analytics.countDocuments({
        type: 'project_click',
        createdAt: { $gte: startDate }
      }),
      
      // Contact form submissions
      Analytics.countDocuments({
        type: 'contact_form_submit',
        createdAt: { $gte: startDate }
      }),
      
      // Page views breakdown
      Analytics.aggregate([
        { $match: { type: 'page_view', createdAt: { $gte: startDate } } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Top clicked projects
      Analytics.aggregate([
        { $match: { type: 'project_click', createdAt: { $gte: startDate } } },
        { $group: { _id: '$projectId', clicks: { $sum: 1 } } },
        { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } },
        { $unwind: '$project' },
        { $project: { title: '$project.title', clicks: 1 } },
        { $sort: { clicks: -1 } },
        { $limit: 5 }
      ]),
      
      // Device type breakdown
      Analytics.aggregate([
        { $match: { type: 'page_view', createdAt: { $gte: startDate } } },
        { $group: { _id: '$metadata.deviceType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Daily stats for charts
      Analytics.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              type: "$type"
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.date": 1 } }
      ]),
      
      // Recent contact submissions
      Contact.find({ createdAt: { $gte: startDate } })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('name email createdAt status'),
      
      // Calculate bounce rate (sessions with only 1 page view)
      VisitorSession.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            bounced: { $sum: { $cond: [{ $eq: ["$pageViews", 1] }, 1, 0] } }
          }
        }
      ])
    ]);
    
    // Process daily stats for frontend
    const chartData = {};
    dailyStats.forEach(stat => {
      const date = stat._id.date;
      if (!chartData[date]) {
        chartData[date] = { date, page_views: 0, project_clicks: 0, contact_submissions: 0 };
      }
      chartData[date][stat._id.type] = stat.count;
    });
    
    const chartDataArray = Object.values(chartData).sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate bounce rate percentage
    const bounceRatePercentage = bounceRate.length > 0 && bounceRate[0].totalSessions > 0
      ? Math.round((bounceRate[0].bounced / bounceRate[0].totalSessions) * 100)
      : 0;
    
    res.json({
      summary: {
        totalViews,
        uniqueVisitors,
        projectClicks,
        contactSubmissions,
        bounceRate: bounceRatePercentage
      },
      charts: {
        dailyStats: chartDataArray,
        pageViews: pageViews.map(p => ({ page: p._id || 'Unknown', views: p.count })),
        deviceStats: deviceStats.map(d => ({ device: d._id || 'Unknown', count: d.count })),
        topProjects: topProjects.map(p => ({ title: p.title, clicks: p.clicks }))
      },
      recentActivity: {
        contacts: recentContacts
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
});

// Get real-time stats (admin only)
router.get('/realtime', adminMiddleware, async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);
    
    const [activeUsers, recentViews, liveEvents] = await Promise.all([
      VisitorSession.countDocuments({
        lastActivity: { $gte: lastHour },
        isActive: true
      }),
      Analytics.countDocuments({
        type: 'page_view',
        createdAt: { $gte: last24Hours }
      }),
      Analytics.find({
        createdAt: { $gte: lastHour }
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('projectId', 'title')
        .select('type page createdAt metadata.deviceType projectId')
    ]);
    
    res.json({
      activeUsers,
      recentViews,
      liveEvents: liveEvents.map(event => ({
        type: event.type,
        page: event.page,
        project: event.projectId?.title,
        device: event.metadata?.deviceType,
        time: event.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching real-time analytics:', error);
    res.status(500).json({ message: 'Failed to fetch real-time data' });
  }
});

// Update contact status (admin only)
router.patch('/contacts/:id/status', adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json({ message: 'Contact status updated', contact });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ message: 'Failed to update contact status' });
  }
});

export default router;