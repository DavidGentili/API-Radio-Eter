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
    query: id (optional)
    return: 200 - [Users] || 4-- errorMessage

###### Delete User
    path: /users
    method: delete
    headers: authorization
    payload: id
    return: 200 - {checkMessage} || 4-- errorMessage

#### Ads

###### Create Ad
    path: /ad
    method: post
    headers: authorization, Content-Type : multipart/form-data
    payload: name, altText (notRequired), link (notRequired), type 
    return: 200 - {checkMessage} || 4-- errorMessage

###### Get Ad
    path: /ad
    method: post
    headers: authorization
    payload: adId, name (notRequired), altText (notRequired), link (notRequired), type (notRequired)
    query: type (optional);
    return: 200 - [ads] || 4-- errorMessage

###### Update Ad
    path: /ad
    method: post
    headers: authorization, Content-Type : multipart/form-data
    payload: adId, name (notRequired), altText (notRequired), link (notRequired), type (notRequired)
    return: 200 - {checkMessage} || 4-- errorMessage

###### Delete Ad
    path: /ad
    method: Delete
    headers: authorization
    payload: adId
    return: 200 - {checkMessage} || 4-- errorMessage

#### Program

###### Create Program
    path: /program
    method: post
    headers: authorization
    payload: name, startHour, finishHour, highlightled, days,  
    return: 200 - {checkMessage} || 4-- errorMessage

