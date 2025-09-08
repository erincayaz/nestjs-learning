# Authentication

This project is using JWT and roles for authenticaton

To create a new user, you can use `auth` and `user` endpoints. With `register` endpoint you can create a new user and use update endpoint in `user` to give that user Admin permission if needed.

Role of the user, vendorId that user is belongs to and userId is stored in JWT token. And these information is used to ensure that users can update things that they have permission to.

Also JWT and Role guards are used in some endpoints.