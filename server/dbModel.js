const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formDataSchema = new Schema({
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phoneNumber: { 
        type: String, 
        required: true 
    },
    hobbies: [{ 
        type: String, 
        required: true 
    }],
    gender: { 
        type: String, 
        required: true 
    },
    filePath: { 
        type: String,
        default: null  
    }
});

module.exports = mongoose.model('FormData', formDataSchema);
