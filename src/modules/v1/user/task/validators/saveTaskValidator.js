import validateSchema from '~/utils/validate'

// create schema for saving task api
const schema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            minLength: 1,
            maxLength: 60,
            errorMessage: {
                type: 'The title field must be a string',
                minLength: 'Must have required property title.',
                maxLength: 'title may have maximum 60 characters.'
            }
        },
        description: {
            type: "string",
            minLength: 1,
            maxLength: 100,
            errorMessage: {
                type: 'The description field must be a string',
                minLength: 'Must have required property description.',
                maxLength: 'description may have maximum 100 characters.'
            }
        },
        status: {
            enum: ["pending","in-progress","completed"], // Options: pending,in-progress,completed
            errorMessage: {
                enum: "status must be equal to one of the allowed values (pending,in-progress,completed)."
            }
        }
    },

    required: ["title","description","status"], //set required paramenter
    additionalProperties: true, //make addition parameter allow in request body by makeing additionalProperties =true 
}
// save task field's validation 
export const saveTaskValidator = function(req, res, next) {
    const isValid = validateSchema(req, schema);
    //check if isvalid status false return validation response
    if (!isValid.status) {
        // return response 
        return res.status(isValid.status_code).json(isValid.error);
    }
    next();
}