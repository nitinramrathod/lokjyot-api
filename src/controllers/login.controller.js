const User = require('../models/user.model');
const { validateLogin } = require('../schema-validation/login.validation');
const bodyParser = require('../utils/helper/bodyParser');


const login = async (request, reply) => {
    try {
        if (!request.isMultipart()) {
            return reply
                .status(422)
                .send({ error: "Request must be multipart/form-data" });
        }

        let fields = await bodyParser(request);

        const validationResponse = await validateLogin(fields, reply);
        if (validationResponse) return;

        const { email, password } = fields;

        const user = await User.findOne({ email });

        console.log('User found:', user); // Log the user object
        console.log('User email:', email); // Log the user object
        console.log('User password:', password); // Log the user object

        if (!user || !(await user.comparePassword(password))) {
            return reply.status(422).send({ message: 'Invalid email or password.' });
        }

        const token = await reply.jwtSign(
            { userId: user._id, email: user.email, role: user?.role },
            { expiresIn: '48h' }
        );

        reply.send({ user: { id: user._id, name: user?.name, mobile: user?.mobile, image: user?.image, email: user.email, role: user?.role }, token });

    } catch (error) {
        console.error('Error in login:', error);
        reply.status(500).send({ message: 'An error occurred while logging in.' });
    }
};

module.exports = {login};