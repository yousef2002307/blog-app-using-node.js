const Specification = require("../Specification");
const bcrypt = require("bcrypt");
// ==================== Name Specifications ====================





// ==================== Email Specifications ====================

class EmailRequiredSpecification extends Specification {
    message = "Email is required";
    isSatisfiedBy({ email }) {
        return typeof email === "string" && email.trim().length > 0;
    }
}

class EmailFormatSpecification extends Specification {
    message = "Email must be a valid email address";
    isSatisfiedBy({ email }) {
        if (!email || typeof email !== "string") return false;
        // Standard email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }
}

const UserRepo = require("../../Repos/UserRepo")

class iscredendtialsistrue extends Specification {
    constructor(){
        super()
       
    }

    message = "Invalid credentials";
 statusCode = 401; 
    async isSatisfiedBy({ email, password }) {
         this.data = {};
        const user = await UserRepo.findByEmail(email);
     
        if (!user) {
           
            return false;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
           
            return false;
        }
           this.data = user;
        return true;
    }
}

// ==================== Password Specifications ====================

class PasswordRequiredSpecification extends Specification {
    message = "Password is required";
    isSatisfiedBy({ password }) {
        return typeof password === "string" && password.trim().length > 0;
    }
}





// ==================== Composed Specifications ====================


const EmailSpecification = new EmailRequiredSpecification()
    .and(new EmailFormatSpecification());

const PasswordSpecification = new PasswordRequiredSpecification();
   

const LoginSpecification = EmailSpecification
    .and(PasswordSpecification)
    .and(new iscredendtialsistrue());

module.exports = {
    LoginSpecification,
    EmailSpecification,
    PasswordSpecification,
    EmailRequiredSpecification,
    EmailFormatSpecification,
  
    EmailRequiredSpecification,
    EmailFormatSpecification,

    PasswordRequiredSpecification,
   
};

