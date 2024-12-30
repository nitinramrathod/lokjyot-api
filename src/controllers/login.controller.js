const User = require('../models/user.model');


const login = async (request, reply) => {
    try {
        const { email, password } = request.body;

        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return reply.status(401).send({ message: 'Invalid email or password.' });
        }

        const token = await reply.jwtSign(
            { userId: user._id, email: user.email, role: user?.role },
            { expiresIn: '48h' }
        );

        reply.send({ user: { id: user._id, name: user.name, email: user.email, role: user?.role }, token });

    } catch (error) {
        console.error('Error in login:', error);
        reply.status(500).send({ message: 'An error occurred while logging in.' });
    }
};

module.exports = {login};