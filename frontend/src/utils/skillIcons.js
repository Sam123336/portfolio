// Skill icon mapping for Devicons and fallback emojis
export const getSkillIcon = (skillName) => {
  const name = skillName.toLowerCase().trim();
  
  // Devicon class mappings for popular technologies
  const deviconMap = {
    // Frontend
    'javascript': 'devicon-javascript-plain',
    'js': 'devicon-javascript-plain',
    'typescript': 'devicon-typescript-plain',
    'ts': 'devicon-typescript-plain',
    'react': 'devicon-react-original',
    'reactjs': 'devicon-react-original',
    'vue': 'devicon-vuejs-plain',
    'vue.js': 'devicon-vuejs-plain',
    'vuejs': 'devicon-vuejs-plain',
    'angular': 'devicon-angularjs-plain',
    'angularjs': 'devicon-angularjs-plain',
    'html': 'devicon-html5-plain',
    'html5': 'devicon-html5-plain',
    'css': 'devicon-css3-plain',
    'css3': 'devicon-css3-plain',
    'sass': 'devicon-sass-original',
    'scss': 'devicon-sass-original',
    'less': 'devicon-less-plain-wordmark',
    'tailwind': 'devicon-tailwindcss-plain',
    'tailwindcss': 'devicon-tailwindcss-plain',
    'bootstrap': 'devicon-bootstrap-plain',
    'jquery': 'devicon-jquery-plain',
    'webpack': 'devicon-webpack-plain',
    'vite': 'devicon-vitejs-plain',
    'nextjs': 'devicon-nextjs-original',
    'next.js': 'devicon-nextjs-original',
    'nuxt': 'devicon-nuxtjs-plain',
    'nuxt.js': 'devicon-nuxtjs-plain',

    // Backend
    'node': 'devicon-nodejs-plain',
    'nodejs': 'devicon-nodejs-plain',
    'node.js': 'devicon-nodejs-plain',
    'express': 'devicon-express-original',
    'expressjs': 'devicon-express-original',
    'express.js': 'devicon-express-original',
    'nestjs': 'devicon-nestjs-plain',
    'nest.js': 'devicon-nestjs-plain',
    'fastify': 'devicon-fastify-plain',
    'koa': 'devicon-nodejs-plain', // No specific Koa icon, using Node.js
    
    // Programming Languages
    'python': 'devicon-python-plain',
    'java': 'devicon-java-plain',
    'c++': 'devicon-cplusplus-plain',
    'cpp': 'devicon-cplusplus-plain',
    'c#': 'devicon-csharp-plain',
    'csharp': 'devicon-csharp-plain',
    'c': 'devicon-c-plain',
    'go': 'devicon-go-original-wordmark',
    'golang': 'devicon-go-original-wordmark',
    'rust': 'devicon-rust-plain',
    'php': 'devicon-php-plain',
    'ruby': 'devicon-ruby-plain',
    'swift': 'devicon-swift-plain',
    'kotlin': 'devicon-kotlin-plain',
    'dart': 'devicon-dart-plain',
    'scala': 'devicon-scala-plain',
    'r': 'devicon-r-original',
    'matlab': 'devicon-matlab-plain',

    // Python Frameworks
    'django': 'devicon-django-plain',
    'flask': 'devicon-flask-original',
    'fastapi': 'devicon-fastapi-plain',
    'pyramid': 'devicon-python-plain',

    // Java Frameworks
    'spring': 'devicon-spring-plain',
    'spring boot': 'devicon-spring-plain',
    'springboot': 'devicon-spring-plain',

    // PHP Frameworks
    'laravel': 'devicon-laravel-plain',
    'symfony': 'devicon-symfony-original',
    'codeigniter': 'devicon-codeigniter-plain',

    // Ruby Frameworks
    'rails': 'devicon-rails-plain',
    'ruby on rails': 'devicon-rails-plain',

    // Databases
    'mongodb': 'devicon-mongodb-plain',
    'mongo': 'devicon-mongodb-plain',
    'postgresql': 'devicon-postgresql-plain',
    'postgres': 'devicon-postgresql-plain',
    'mysql': 'devicon-mysql-plain',
    'sqlite': 'devicon-sqlite-plain',
    'redis': 'devicon-redis-plain',
    'elasticsearch': 'devicon-elasticsearch-plain',
    'oracle': 'devicon-oracle-original',
    'mariadb': 'devicon-mysql-plain', // Using MySQL icon for MariaDB
    'cassandra': 'devicon-cassandra-plain',

    // Cloud & DevOps
    'aws': 'devicon-amazonwebservices-original',
    'amazon web services': 'devicon-amazonwebservices-original',
    'azure': 'devicon-azure-plain',
    'gcp': 'devicon-googlecloud-plain',
    'google cloud': 'devicon-googlecloud-plain',
    'docker': 'devicon-docker-plain',
    'kubernetes': 'devicon-kubernetes-plain',
    'k8s': 'devicon-kubernetes-plain',
    'terraform': 'devicon-terraform-plain',
    'jenkins': 'devicon-jenkins-line',
    'ansible': 'devicon-ansible-plain',
    'vagrant': 'devicon-vagrant-plain',
    'nginx': 'devicon-nginx-original',
    'apache': 'devicon-apache-plain',

    // Version Control
    'git': 'devicon-git-plain',
    'github': 'devicon-github-original',
    'gitlab': 'devicon-gitlab-plain',
    'bitbucket': 'devicon-bitbucket-original',

    // IDEs & Editors
    'vscode': 'devicon-vscode-plain',
    'visual studio code': 'devicon-vscode-plain',
    'intellij': 'devicon-intellij-plain',
    'pycharm': 'devicon-pycharm-plain',
    'webstorm': 'devicon-webstorm-plain',
    'atom': 'devicon-atom-original',
    'sublime': 'devicon-sublime-text-plain',
    'vim': 'devicon-vim-plain',
    'emacs': 'devicon-emacs-original',

    // Operating Systems
    'linux': 'devicon-linux-plain',
    'ubuntu': 'devicon-ubuntu-plain',
    'debian': 'devicon-debian-plain',
    'centos': 'devicon-centos-plain',
    'windows': 'devicon-windows8-original',
    'macos': 'devicon-apple-original',
    'apple': 'devicon-apple-original',

    // Mobile Development
    'android': 'devicon-android-plain',
    'ios': 'devicon-apple-original',
    'react native': 'devicon-react-original',
    'flutter': 'devicon-flutter-plain',
    'ionic': 'devicon-ionic-original',
    'xamarin': 'devicon-xamarin-original',
    'cordova': 'devicon-cordova-plain',

    // Testing
    'jest': 'devicon-jest-plain',
    'mocha': 'devicon-mocha-plain',
    'jasmine': 'devicon-jasmine-plain',
    'selenium': 'devicon-selenium-original',
    'cypress': 'devicon-cypress-plain',

    // Build Tools
    'npm': 'devicon-npm-original-wordmark',
    'yarn': 'devicon-yarn-plain',
    'gulp': 'devicon-gulp-plain',
    'grunt': 'devicon-grunt-line',
    'babel': 'devicon-babel-plain',

    // Design Tools
    'figma': 'devicon-figma-plain',
    'sketch': 'devicon-sketch-line',
    'photoshop': 'devicon-photoshop-plain',
    'illustrator': 'devicon-illustrator-plain',
    'xd': 'devicon-xd-plain',
    'adobe xd': 'devicon-xd-plain',

    // Analytics & Monitoring
    'grafana': 'devicon-grafana-original',
    'prometheus': 'devicon-prometheus-original',

    // Others
    'firebase': 'devicon-firebase-plain',
    'graphql': 'devicon-graphql-plain',
    'apollo': 'devicon-apollographql-plain',
    'redux': 'devicon-redux-original',
    'jquery': 'devicon-jquery-plain',
    'materialize': 'devicon-materialize-plain',
    'bulma': 'devicon-bulma-plain',
    'electron': 'devicon-electron-original',
    'socketio': 'devicon-socketio-original',
    'socket.io': 'devicon-socketio-original',
  };

  // Fallback emoji mappings for skills without devicons
  const emojiMap = {
    // General categories
    'machine learning': '🤖',
    'ai': '🤖',
    'artificial intelligence': '🤖',
    'data science': '📊',
    'blockchain': '⛓️',
    'cryptocurrency': '₿',
    'web3': '🌐',
    'defi': '💰',
    'nft': '🖼️',
    'iot': '📡',
    'internet of things': '📡',
    'cybersecurity': '🔒',
    'security': '🔒',
    'ui/ux': '🎨',
    'design': '🎨',
    'frontend': '💻',
    'backend': '⚙️',
    'fullstack': '🔧',
    'devops': '🔄',
    'mobile': '📱',
    'game development': '🎮',
    'ar': '🥽',
    'vr': '🥽',
    'augmented reality': '🥽',
    'virtual reality': '🥽',
    'api': '🔌',
    'microservices': '🔧',
    'serverless': '☁️',
    'cloud': '☁️',
    'database': '🗄️',
    'nosql': '🗃️',
    'sql': '🗄️',
    'testing': '🧪',
    'automation': '🤖',
    'ci/cd': '🔄',
    'monitoring': '📊',
    'performance': '⚡',
    'optimization': '⚡',
    'seo': '🔍',
    'analytics': '📈',
    'cms': '📝',
    'wordpress': '📝',
    'shopify': '🛒',
    'ecommerce': '🛒',
    'payment': '💳',
    'stripe': '💳',
    'paypal': '💰',
    
    // Specialized tools
    'postman': '📮',
    'insomnia': '😴',
    'swagger': '📋',
    'jira': '📊',
    'confluence': '📚',
    'slack': '💬',
    'discord': '🎮',
    'teams': '👥',
    'zoom': '📹',
    'notion': '📝',
    'trello': '📋',
    'asana': '✅',
    'monday': '📅',
    
    // Default fallbacks
    'default': '⚡'
  };

  // First try to find in devicon map
  if (deviconMap[name]) {
    return {
      type: 'devicon',
      className: deviconMap[name],
      colored: deviconMap[name].includes('original') || deviconMap[name].includes('plain-wordmark')
    };
  }

  // Then try emoji map
  if (emojiMap[name]) {
    return {
      type: 'emoji',
      emoji: emojiMap[name]
    };
  }

  // Try partial matching for devicons
  for (const [key, className] of Object.entries(deviconMap)) {
    if (name.includes(key) || key.includes(name)) {
      return {
        type: 'devicon',
        className,
        colored: className.includes('original') || className.includes('plain-wordmark')
      };
    }
  }

  // Try partial matching for emojis
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (name.includes(key) || key.includes(name)) {
      return {
        type: 'emoji',
        emoji
      };
    }
  }

  // Default fallback
  return {
    type: 'emoji',
    emoji: '⚡'
  };
};

// Get suggested icon for skill name (for admin form)
export const getSuggestedIcon = (skillName) => {
  const iconData = getSkillIcon(skillName);
  
  if (iconData.type === 'devicon') {
    return `devicon:${iconData.className}`;
  } else {
    return iconData.emoji;
  }
};

// Parse icon string from database
export const parseIconString = (iconString) => {
  if (!iconString) return null;
  
  // Check if it's a devicon reference
  if (iconString.startsWith('devicon:')) {
    const className = iconString.replace('devicon:', '');
    return {
      type: 'devicon',
      className,
      colored: className.includes('original') || className.includes('plain-wordmark')
    };
  }
  
  // Otherwise treat as emoji
  return {
    type: 'emoji',
    emoji: iconString
  };
};