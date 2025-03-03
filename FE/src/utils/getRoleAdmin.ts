import { Role } from '../models/Role';
export const isAdmin = (roles: Role[]) => {
    return roles.find((role) => role.name === 'ADMIN');
}