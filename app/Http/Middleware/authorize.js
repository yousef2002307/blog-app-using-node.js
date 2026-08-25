/**
 * Authorization middleware — checks that the authenticated user
 * holds ALL of the required permissions (stored in the JWT payload).
 *
 * Usage:
 *   router.delete('/post/:id', verifyJWT, authorize('post:delete'), handler);
 *
 * @param  {...string} requiredPermissions
 */
const authorize = (...requiredPermissions) => {
    return (req, res, next) => {
        const userPermissions = req.user?.permissions ?? [];

        const hasAll = requiredPermissions.every((perm) =>
            userPermissions.includes(perm)
        );

        if (!hasAll) {
            return res.status(403).json({
                message: 'Forbidden: you do not have permission to perform this action',
            });
        }

        next();
    };
};

module.exports = authorize;
