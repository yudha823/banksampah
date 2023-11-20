const test_api = async (req, res, next) => {
    try {
        res.send({ message: 'Pengujian sukses' });
    } catch (e) {
        console.error('Error saat melakukan pengujian API: ', e);
        res.status(500).send({ error: e.toString() });
    }
};

module.exports = {
    test_api
};
