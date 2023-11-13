const models = require('../models');
const Domo = models.Domo;

const makerPage = async (req, res) => {
    return res.render('app');
}

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.level) {
        return res.status(400).json({ error: 'Name, age, and level are required!' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        level: req.body.level,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({ name: newDomo.name, age: newDomo.age, level: newDomo.level });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists!' });
        }
        return res.status(500).json({ error: 'An error occurred making domo!' });
    }
}

const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Domo.find(query).select('name age level').lean().exec();

        return res.json({ domos: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!' });
    }
};

const deleteDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        console.log(query);
        await Domo.collection('domos').deleteOne(query);
        return res.status(201).json({ success: 'Deleted Domo!'});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error deleting domos!' });
    }
};

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    deleteDomos,
};
