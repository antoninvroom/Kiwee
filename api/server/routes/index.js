var express = require('express');
var router = express.Router();

var auth = require('../controllers/auth.js');
var requests = require('../controllers/requests.js');
var feeds = require('../controllers/feeds.js');
var users = require('../controllers').users;
var lists = require('../controllers/lists.js');
var events = require('../controllers/events.js');
var categories = require('../controllers/categories.js');
var discoveries = require('../controllers/discoveries.js');

/*
 * Routes that can be accessed by any one
 */
router.post('/auth', auth.connect);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/v1/access', function(req, res){ res.json({ message: "All is goooood" }); });

// Les requêtes concernant les invitations
router.get('/v1/requests', requests.getNews); // récupérer les dernières invitations reçues
router.get('/v1/request/accept/:id', requests.accept); // accepter une invitation
router.get('/v1/request/decline/:id', requests.decline); // refuser une invitation
router.post('/v1/request/:uid', requests.send); // envoyer une invitation à quelqu'un

// Le mur d'actualités
router.get('/v1/feeds/:start*?', feeds.getAll); // afficher toutes les actualités
router.get('/v1/post', feeds.newPost); // poster un statut / une humeur

// Les utilisateurs
router.get('/v1/me', users.me); // recuperer ses propres infos + sa liste d'amis
router.put('/v1/me', users.sync); // mettre à jour sa liste d'amis
router.get('/v1/user/:uid', users.getOne); // recuperer le profil public d'un ami

// Les listes d'amis personnalisées
router.get('/v1/user/lists', lists.getAll); // afficher toutes les listes
router.get('/v1/user/list/:id', lists.getOne); // afficher une liste
router.post('/v1/user/list', lists.create); // créer une liste
router.delete('/v1/user/list/:id', lists.delete); // supprimer la liste
router.put('/v1/user/list/:id', lists.update); // modifier le nom de la liste
router.put('/v1/user/list/:id/add/:uid', lists.addOne); // ajouter un ami à la liste
router.delete('/v1/user/list/:id/remove/:uid', lists.removeOne); // supprimer un ami de la liste

// Les amis
//router.get('/v1/user/friends', friends.getAll); // afficher la liste d'amis

// Les événements créés par les utilisateurs
router.get('/v1/events/:start*?', events.getNext); // recuperer tous les événements à venir de l'utilisateur
router.get('/v1/events/past', events.getPast); // recuperer tous les événements passés de l'utilisateur
router.get('/v1/event/:id', events.getOne); // recuperer les infos d'un événement avec les participants et invités
router.post('/v1/event', events.create); // créer un événement
router.put('/v1/event/:id', events.update); // modifier un événement / gérer les paramètres
router.get('/v1/event/:id/leave', events.leave); // quitter un événement
router.delete('/v1/event/:id', events.cancel); // annuler un événement

// Les messages
router.post('/v1/event/:id/message', events.messages.create); // Poster un message
router.get('/v1/event/:id/messages/:start*?', events.messages.getAll); // Récupérer les messages de la discussion

// Les catégories et filtres
router.get('/v1/categories', categories.getAll); // affiche les catégories d'événements

// Les lieux suggérés et découvertes
router.get('/v1/discoveries', discoveries.getAll); // affiche tous les bons plan à venir
router.get('/v1/discoveries/filters', discoveries.getFilters); // affiche tous les filtres
router.get('/v1/discoveries/filter/:category', discoveries.getByFilter); // affiche selon une catégorie
router.get('/v1/discovery/:id', discoveries.getOne); // recuperer les infos d'un endroit
router.get('/v1/discovery/fav', discoveries.fav); // ajouter un endroit en favori

router.all('*', function(req, res) {
  res.statusCode = 404;
  res.json({
    statusCode: 404,
    error: "Not Found"
  });
});
/*
 * Routes that can be accessed only by authenticated & authorized users
 */
// router.get('/v1/admin/users', user.getAll);
// router.get('/v1/admin/user/:id', user.getOne);
// router.post('/v1/admin/user/', user.create);
// router.put('/v1/admin/user/:id', user.update);
// router.delete('/v1/admin/user/:id', user.delete);

module.exports = router;
