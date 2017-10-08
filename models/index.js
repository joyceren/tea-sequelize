'use strict'

const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost/teas', { logging: false });

const Tea = db.define('tea', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  price: Sequelize.INTEGER,
  category: Sequelize.ENUM('green', 'black', 'herbal'),
  dollarPrice: {
    type: Sequelize.VIRTUAL,
    get() {return `$${(this.price/100).toFixed(2)}`}
  }
}, {
  hooks: {
    beforeCreate: (tea) => {
      tea.title = tea.title.split(' ').map(e => e[0].toUpperCase()+e.slice(1)).join(' ')
    }
  },
  instanceMethods: {
    findSimilar: function() {console.log(this)}
  }
})

Tea.findByCategory = function(cat){
  return this.findAll({
    where: {
      category: cat
    }
  })
}

Tea.prototype.findSimilar = function(){
  return Tea.findAll({
    where: {
      title: this.title
    }
  })
}


module.exports = { db, Tea };
