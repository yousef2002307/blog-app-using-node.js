class Specification {
    /** Human-readable reason this spec failed. Override in subclasses. */
    message = "Validation failed";
    statusCode = 400;
    _data = {};

    get data() {
        return this._data;
    }

    set data(val) {
        this._data = val;
    }

    /**
     * @param {*} candidate
     * @returns {Promise<boolean>|boolean}
     */
    async isSatisfiedBy(candidate) {
        throw new Error("isSatisfiedBy() must be implemented by subclass");
    }

    /**
     * Returns an array of failure objects { message, statusCode } for all specifications that failed.
     * @param {*} candidate
     * @returns {Promise<{ message: string, statusCode: number }[]>}
     */
    async getFailures(candidate) {
        const satisfied = await this.isSatisfiedBy(candidate);
        return satisfied ? [] : [{ message: this.message, statusCode: this.statusCode }];
    }

    /**
     * Returns an array of error messages for all specifications that failed.
     * @param {*} candidate
     * @returns {Promise<string[]>}
     */
    async getErrors(candidate) {
        const failures = await this.getFailures(candidate);
        return failures.map(f => f.message);
    }

    /**
     * Convenience wrapper — returns { valid, message, errors, statusCode }.
     * @param {*} candidate
     * @returns {Promise<{ valid: boolean, message: string|null, errors: string[], statusCode: number }>}
     */
    async validate(candidate) {
        const failures = await this.getFailures(candidate);
        const firstFailure = failures[0];
        return {
            valid: failures.length === 0,
            message: firstFailure ? firstFailure.message : null,
            errors: failures.map(f => f.message),
            statusCode: firstFailure ? firstFailure.statusCode : 200,
            data: this.data
        };
    }

    and(other) { return new AndSpecification(this, other); }
    or(other)  { return new OrSpecification(this, other);  }
    not()      { return new NotSpecification(this);         }
}

class AndSpecification extends Specification {
    constructor(left, right) {
        super();
        this.left  = left;
        this.right = right;
    }

    get data() {
        return { ...this.left.data, ...this.right.data };
    }

    async isSatisfiedBy(candidate) {
        const leftOk  = await this.left.isSatisfiedBy(candidate);
        const rightOk = await this.right.isSatisfiedBy(candidate);
        return leftOk && rightOk;
    }

    async getFailures(candidate) {
        const leftFailures  = await this.left.getFailures(candidate);
        const rightFailures = await this.right.getFailures(candidate);
        return [...leftFailures, ...rightFailures];
    }
}

class OrSpecification extends Specification {
    constructor(left, right) {
        super();
        this.left  = left;
        this.right = right;
    }

    get data() {
        return { ...this.left.data, ...this.right.data };
    }

    async isSatisfiedBy(candidate) {
        const leftOk  = await this.left.isSatisfiedBy(candidate);
        if (leftOk) return true;
        return await this.right.isSatisfiedBy(candidate);
    }

    async getFailures(candidate) {
        const satisfied = await this.isSatisfiedBy(candidate);
        if (satisfied) return [];
        const leftFailures  = await this.left.getFailures(candidate);
        const rightFailures = await this.right.getFailures(candidate);
        return [...leftFailures, ...rightFailures];
    }
}

class NotSpecification extends Specification {
    constructor(wrapped) {
        super();
        this.wrapped = wrapped;
        this.message = `Must NOT satisfy: ${wrapped.message}`;
    }

    get data() {
        return this.wrapped.data;
    }

    async isSatisfiedBy(candidate) {
        const ok = await this.wrapped.isSatisfiedBy(candidate);
        return !ok;
    }

    async getFailures(candidate) {
        const satisfied = await this.isSatisfiedBy(candidate);
        return satisfied ? [] : [{ message: this.message, statusCode: this.statusCode }];
    }
}

module.exports = Specification;

