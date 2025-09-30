- Use `useAuth()` to access `currentUser`, `isAdmin`, `login`, and `logout` in your components.
- On login, pass email, password, and admin flag. The user will be stored automatically.
- On logout, call `logout()`.
- No need to handle tokens or verify endpoints.

## Example

```js
const { login, logout, currentUser, isAdmin } = useAuth();
// login(email, password, isAdminFlag)
// logout()
```
