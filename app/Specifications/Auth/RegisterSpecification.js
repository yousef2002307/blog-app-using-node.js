const Specification = require("../Specification");

// ==================== Name Specifications ====================

class NameRequiredSpecification extends Specification {
    message = "Name is required";
    isSatisfiedBy({ name }) {
        return typeof name === "string" && name.trim().length > 0;
    }
}

class NameLengthSpecification extends Specification {
    message = "Name must be between 2 and 50 characters";
    isSatisfiedBy({ name }) {
        if (!name || typeof name !== "string") return false;
        const len = name.trim().length;
        return len >= 2 && len <= 50;
    }
}

class NameFormatSpecification extends Specification {
    message = "Name can only contain letters and spaces";
    isSatisfiedBy({ name }) {
        if (!name || typeof name !== "string") return false;
        return /^[a-zA-Z\s]+$/.test(name.trim());
    }
}

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

class EmailUniqueSpecification extends Specification {
    constructor() {
        super();
      
    }

    message = "Email is already registered";

    async isSatisfiedBy({ email }) {
        return !await UserRepo.findByEmail(email);
    }
}

// ==================== Password Specifications ====================

class PasswordRequiredSpecification extends Specification {
    message = "Password is required";
    isSatisfiedBy({ password }) {
        return typeof password === "string" && password.trim().length > 0;
    }
}

class PasswordMinLengthSpecification extends Specification {
    message = "Password must be at least 8 characters long";
    isSatisfiedBy({ password }) {
        return typeof password === "string" && password.length >= 8;
    }
}

class PasswordComplexitySpecification extends Specification {
    message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    isSatisfiedBy({ password }) {
        if (typeof password !== "string") return false;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        return hasUpper && hasLower && hasNumber && hasSpecial;
    }
}

// ==================== Composed Specifications ====================

const NameSpecification = new NameRequiredSpecification()
    .and(new NameLengthSpecification())
    .and(new NameFormatSpecification());

const EmailSpecification = new EmailRequiredSpecification()
    .and(new EmailFormatSpecification())
    .and(new EmailUniqueSpecification());

const PasswordSpecification = new PasswordRequiredSpecification()
    .and(new PasswordMinLengthSpecification())
    .and(new PasswordComplexitySpecification());

const RegisterSpecification = NameSpecification
    .and(EmailSpecification)
    .and(PasswordSpecification);

module.exports = {
    RegisterSpecification,
    NameSpecification,
    EmailSpecification,
    PasswordSpecification,
    NameRequiredSpecification,
    NameLengthSpecification,
    NameFormatSpecification,
    EmailRequiredSpecification,
    EmailFormatSpecification,
    EmailUniqueSpecification,
    PasswordRequiredSpecification,
    PasswordMinLengthSpecification,
    PasswordComplexitySpecification
};

