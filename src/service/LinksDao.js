const { Link } = require('../model/Links');

const LinkDao = {

  async createLink(userId, title, url) {
    const link = await Link.create({
      user_id: userId,
      title,
      url,
    });
    return link;
  },

  async getAllLinks(userId) {
    const links = await Link.findAll({
      where: { user_id: userId },
    });
    return links;
  },

  async getLinkById(userId, linkId) {
    const link = await Link.findOne({
      where: { id: linkId, user_id: userId },
    });
    return link;
  },

  async updateLink(userId, linkId, title, url) {
    const link = await Link.findOne({
      where: { id: linkId, user_id: userId },
    });
    if (link) {
      link.title = title;
      link.url = url;
      await link.save();
      return link;
    }
    return null;
  },

  async deleteLink(userId, linkId) {
    const link = await Link.findOne({
      where: { id: linkId, user_id: userId },
    });
    if (link) {
      await link.destroy();
      return true;
    }
    return false;
  },
};

module.exports = { LinkDao };