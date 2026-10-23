# Site de téléchargement — Grace Field House

Site statique d'une seule page : aucun serveur ni outil nécessaire.

- `index.html` : la page de Grace Field House
- `grace.html` : la page « Coming soon » du projet Grace, ouverte en cliquant sur « Grace » dans le titre
- `style.css` : le design (clair ou sombre selon l'ordinateur du visiteur)
- `script.js` : **le seul fichier à modifier pour une nouvelle version** (version, date, liens et tailles)
- `i18n.js` : tous les textes du site, en français, anglais, japonais, chinois et arabe
- `icon.png` : l'icône de l'application
- `captures/` : les captures d’écran de l’application affichées dans « Aperçu »
- `downloads/` : l'installateur et la version portable

## Voir le site

Double-clique sur `index.html`.

## Nouvelle version de l'application

1. Copie les nouveaux fichiers depuis `dist/` de l'application dans `downloads/`,
   en les renommant `GraceFieldHouse-Setup.exe` et `GraceFieldHouse-Portable.exe`.
2. Change `version`, `date` et les tailles au début de `script.js`.

## Mettre en ligne

Les deux fichiers d'installation pèsent environ 107 Mo chacun : c'est trop pour la plupart
des hébergeurs gratuits (GitHub Pages refuse les fichiers de plus de 100 Mo, Netlify et
Vercel les déconseillent).

La solution la plus simple et gratuite :

1. Publie les deux `.exe` dans une **Release GitHub** de ton dépôt
   (onglet « Releases » › « Draft a new release », glisse les fichiers).
2. Dans `script.js`, remplace `downloads/GraceFieldHouse-Setup.exe` et
   `downloads/GraceFieldHouse-Portable.exe` par les liens de la Release.
3. Héberge le reste du site (sans le dossier `downloads/`) sur GitHub Pages, Netlify ou Vercel.

Avec un hébergement classique (mutualisé, OVH, o2switch…), tu peux au contraire tout envoyer
tel quel, `downloads/` compris.

## Langues

À la première visite, une fenêtre propose de choisir la langue (français, anglais, japonais,
chinois, arabe). Le choix est retenu dans le navigateur du visiteur ; le bouton en forme de
globe, en haut à droite, permet d'en changer. En arabe, la page se lit de droite à gauche.

Pour modifier un texte, change-le dans **les cinq langues** de `i18n.js` (même clé dans chaque
bloc). Le texte français de `index.html` sert seulement si JavaScript est désactivé.

## Page « Coming soon » (grace.html)

Le mot « Grace » du titre mène à `grace.html`, une page d'attente animée pour le futur site
Grace. Elle est autonome (son style et son script sont à l'intérieur) : quand le site Grace
existera, remplace simplement le lien `href="grace.html"` dans `index.html` par son adresse,
et supprime `grace.html`.

## Le site en ligne

- Site : https://fslmpo.github.io/gracefieldhouse/
- Dépôt : https://github.com/fslmpo/gracefieldhouse
- Installateurs : dans les Releases du dépôt. Les boutons du site pointent vers
  `releases/latest/download/…` : ils suivent toujours la dernière Release.

**Modifier le site** : change les fichiers ici, puis dans un terminal ouvert dans ce dossier :
`git add -A`, `git commit -m "ce qui a changé"`, `git push`. Le site se met à jour en une minute.

**Publier une nouvelle version de l'application** : crée une Release sur GitHub (nouveau numéro,
par exemple `v1.44.0`) et joins-y `GraceFieldHouse-Setup.exe` et `GraceFieldHouse-Portable.exe`,
avec exactement ces noms. Pense à mettre à jour le numéro de version, la date et la taille au
début de `script.js`.
