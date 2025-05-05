const handleValidationError = async (payload, reply, validationSchema) => {
    try {
        await validationSchema.validateAsync(payload, { abortEarly: false });
       
    } catch (error) {
        const validationErrors = {};
        error?.details?.forEach(err => {
            const field = err.path[0];
            validationErrors[field] = err.message;
        });
        return reply.status(422).send({
            message: 'Validation failed',
            errors: validationErrors,
        });
    }
};

const controllerValidationError = (errors)=>{
    return{
        message: 'Validation failed',
        errors: errors
    }

}



module.exports ={handleValidationError, controllerValidationError}
