const fs = require('fs');
const path = require('path');

// Liste des fichiers CSS à corriger
const cssFiles = [
  'src/app/app.component.css',
  'src/app/features/auth/components/sign-in/sign-in.component.css',
  'src/app/features/dashboard/dashboard-page/dashboard-page.component.css',
  'src/app/features/events/component/add-event/add-event.component.css',
  'src/app/features/events/component/edit-event/edit-event.component.css',
  'src/app/features/events/component/event-details/event-details.component.css',
  'src/app/features/events/component/list-event/list-event.component.css',
  'src/app/features/forums/component/add-forum/add-forum.component.css',
  'src/app/features/forums/component/edit-forum/edit-forum.component.css',
  'src/app/features/forums/component/forum-details/forum-details.component.css',
  'src/app/features/forums/component/list-forum/list-forum.component.css',
  'src/app/features/landing-page/landing-page.component.css',
  'src/app/features/layout/navbar/navbar.component.css',
  'src/app/features/layout/sidebar/sidebar.component.css',
  'src/app/features/marketplace/component/add-skill/add-skill.component.css',
  'src/app/features/marketplace/component/marketplace-detail/marketplace-detail.component.css',
  'src/app/features/marketplace/component/marketplace-list/marketplace-list.component.css',
  'src/app/features/marketplace/component/skills-matching/skills-matching.component.css',
  'src/app/features/marketplace/component/upd-skil/upd-skil.component.css',
  'src/app/features/salons/components/add-salons/add-salons.component.css',
  'src/app/features/salons/components/delete-salons/delete-salons.component.css',
  'src/app/features/salons/components/list-salons/list-salons.component.css',
  'src/app/features/salons/components/salons-sessions/salons-sessions.component.css',
  'src/app/features/salons/components/salons/salons.component.css',
  'src/app/features/salons/components/update-salons/update-salons.component.css',
  'src/app/features/sessions/components/add-sessions/add-sessions.component.css',
  'src/app/features/sessions/components/delete-sessions/delete-sessions.component.css',
  'src/app/features/sessions/components/list-sessions/list-sessions.component.css',
  'src/app/features/sessions/components/sessions/sessions.component.css',
  'src/app/features/sessions/components/update-sessions/update-sessions.component.css'
];

// Contenu CSS par défaut
const defaultCSS = '/* Component Styles */\n';

cssFiles.forEach(filePath => {
  try {
    // Créer le répertoire s'il n'existe pas
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Écrire le contenu CSS par défaut
    fs.writeFileSync(filePath, defaultCSS, 'utf8');
    console.log(`✅ Corrigé: ${filePath}`);
  } catch (error) {
    console.error(`❌ Erreur pour ${filePath}:`, error.message);
  }
});

console.log('🎉 Correction des fichiers CSS terminée !');
