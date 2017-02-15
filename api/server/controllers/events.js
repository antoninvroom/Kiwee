var events = {

  getNext: function(req, res) {
    var allProducts = data; // Spoof a DB call
    res.json(allProducts);
  },

  getPast: function(req, res) {
    var id = req.params.id;
    var product = data[0]; // Spoof a DB call
    res.json(product);
  },

  getOne: function(req, res) {
    var newProduct = req.body;
    data.push(newProduct); // Spoof a DB call
    res.json(newProduct);
  },

  create: function(req, res) {
    var updateProduct = req.body;
    var id = req.params.id;
    data[id] = updateProduct // Spoof a DB call
    res.json(updateProduct);
  },

  update: function(req, res) {
    var id = req.params.id;
    data.splice(id, 1) // Spoof a DB call
    res.json(true);
  },

  leave: function(req, res) {
    var id = req.params.id;
    data.splice(id, 1) // Spoof a DB call
    res.json(true);
  },

  cancel: function(req, res) {
    var id = req.params.id;
    data.splice(id, 1) // Spoof a DB call
    res.json(true);
  },

  messages: {

    create: function(req, res) {
      var id = req.params.id;
      data.splice(id, 1) // Spoof a DB call
      res.json(true);
    },

    getAll: function(req, res) {
      var id = req.params.id;
      data.splice(id, 1) // Spoof a DB call
      res.json(true);
    }

  }
};

var data = [{
  name: 'product 1',
  id: '1'
}, {
  name: 'product 2',
  id: '2'
}, {
  name: 'product 3',
  id: '3'
}];

module.exports = events;
