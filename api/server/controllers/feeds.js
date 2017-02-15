var feeds = {

  getAll: function(req, res) {
    var allProducts = data; // Spoof a DB call
    res.json(allProducts);
  },

  newPost: function(req, res) {
    var allProducts = data; // Spoof a DB call
    res.json(allProducts);
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

module.exports = feeds;
