# API Radio ETER MDP

### Endpoints
#### Users

###### Auth
    path: /users/auth
    method: get
    headers: authorization
    return: 200 - {user} || 403 - unahutorizedUser

###### Signup
    path: /users/signup
    method: post
    headers: authorization
    payload: email, name, securityLevel (notRequired)
    return: 200 - {checkMessage} || 4-- errorMessage

###### Login
    path: /users/login
    method: post
    headers: authorization
    payload: email, password,
    return: 200 - {Token} || 4-- errorMessage

###### Change Password
    path: /users/password
    method: put
    headers: authorization
    payload: currentPassword, newPassword
    return: 200 - {checkMessage} || 4-- errorMessage

###### Edit User
    path: /users
    method: put
    headers: authorization
    payload: idUser, state, securityLevel
    return: 200 - {checkMessage} || 4-- errorMessage

###### Get Users
    path: /users
    method: get
    headers: authorization
    return: 200 - {Users} || 4-- errorMessage

###### Edit User
    path: /users
    method: delete
    headers: authorization
    payload: id
    return: 200 - {checkMessage} || 4-- errorMessage

