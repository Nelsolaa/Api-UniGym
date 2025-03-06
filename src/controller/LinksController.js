const { LinkDao } = require("../service/LinksDao");


const LinkController = {

  async create(req, res) {
    try {
      const { title, url } = req.body;
      const userId = req.user.id; 
      const link = await LinkDao.createLink(userId, title, url);
      res.status(201).json(link);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const userId = req.user.id; 
      const links = await LinkDao.getAllLinks(userId);
      res.json(links);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obter link específico
  async getById(req, res) {
    try {
      const { linkId } = req.params;
      const userId = req.user.id;
      const link = await LinkDao.getLinkById(userId, linkId);
      if (link) {
        res.json(link);
      } else {
        res.status(404).json({ error: 'Link não encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Atualizar link
  async update(req, res) {
    try {
      const { linkId } = req.params;
      const { title, url } = req.body;
      const userId = req.user.id;
      const updatedLink = await LinkDao.updateLink(userId, linkId, title, url);
      if (updatedLink) {
        res.json(updatedLink);
      } else {
        res.status(404).json({ error: 'Link não encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Deletar link
  async delete(req, res) {
    try {
      const { linkId } = req.params;
      const userId = req.user.id;
      const result = await LinkDao.deleteLink(userId, linkId);
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Link não encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = { LinkController };