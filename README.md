# API Radio ETER MDP

### TODO
    Agregar e integrar Timestamps a los modelos restantes

### Endpoints
#### Users

###### Data Struct
    name: String, required
    email: String, required
    password: String, required
    securityLevel: String, required, default: 'editor'
    state: String, required, default: 'active'
    createdAt: Date
    LastLog: Date

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

###### Data Struct
    name: String, required
    urlImage: String
    altText: String
    link: String
    type: String, required
    createdAt: Date
    creatorName: String, required
    creatorId: String, required

###### Create Ad
    path: /ad
    method: post
    headers: authorization,
    payload: name, altText (notRequired), link (notRequired), type, urlImage 
    return: 200 - {checkMessage} || 4-- errorMessage

###### Get Ad
    path: /ad
    method: post
    headers: authorization
    query: type (optional);
    return: 200 - [ads] || 4-- errorMessage

###### Update Ad
    path: /ad
    method: post
    headers: authorization, Content-Type : multipart/form-data
    payload: adId, name (notRequired), altText (notRequired), link (notRequired), type (notRequired), urlImage
    return: 200 - {checkMessage} || 4-- errorMessage

###### Delete Ad
    path: /ad
    method: Delete
    headers: authorization
    payload: adId
    return: 200 - {checkMessage} || 4-- errorMessage

#### Program

###### Data Struct
    name: String, required
    startHour: String, required{ type: String, require: true },
    finishHour: String, required{ type: String, require: true },
    days : [Boolean], required{ type: [Boolean], require: true },
    highlighted : Boolean, required
    urlImage: String{ type: String },
    creatorName: String, required
    creatorId: String, required

###### Create Program
    path: /program
    method: post
    headers: authorization
    payload: name, startHour, finishHour, highlightled, days, urlImage
    return: 200 - {checkMessage} || 4-- errorMessage

###### Get Program
    path: /program
    method: get
    headers: authorization 
    return: 200 - {programs} || 4-- errorMessage

###### update Program
    path: /program
    method: put
    headers: authorization
    payload: ProgramId, name, startHour, finishHour, highlightled, days, urlImage  
    return: 200 - {checkMessage} || 4-- errorMessage

###### Delete Program
    path: /program
    method: delete
    headers: authorization
    payload: ProgramId,  
    return: 200 - {checkMessage} || 4-- errorMessage


#### Special transmission

###### Data Struct
    name: String, required
    startTransmission: Date, required
    finishTransmission: Date, required
    active : Boolean, required
    creatorName: String, required
    creatorId: String, required

###### Create transmission
    path: /specialtransmission
    method: post
    headers: authorization
    payload: name, startTransmission, finishTransmission,   
    return: 200 - {checkMessage} || 4-- errorMessage

###### Get transmission
    path: /specialtransmission
    method: get
    headers: authorization
    return: 200 - {specialTransmissions} || 4-- errorMessage

###### Update transmission
    path: /specialtransmission
    method: put
    headers: authorization
    payload: TransmissionId, name, startTransmission, finishTransmission, active  
    return: 200 - {checkMessage} || 4-- errorMessage


###### Delete transmission
    path: /specialtransmission
    method: delete
    headers: authorization
    payload: TransmissionId, 
    return: 200 - {checkMessage} || 4-- errorMessage

#### Program Grid

###### Get Program Grid
    path: /programgrid
    method: post
    headers: authorization
    query: day, 
    return: 200 - [programGrid] || 4-- errorMessage

###### Get Current Program
    path: /currentprogram
    method: post
    return: 200 - {program} || 4-- errorMessage

#### Storage File

###### Data Struct
    name : String, required
    urlName : String, required
    data : Buffer, required

###### Get files
    path: /media
    method: get
    headers: authorization
    query: id, urlName
    return: 200 - {medias} || 4-- errorMessage

###### Create file
    path: /media
    method: post
    headers: authorization, Content-Type : multipart/form-data
    body : {name, type, mediaFile}
    return: 200 - {message} || 4-- errorMessage

###### delete file
    path: /media
    method: post
    headers: authorization, Content-Type : multipart/form-data
    body: id || urlName,
    return: 200 - {message} || 4-- errorMessage


#### Reports

###### Data Struct
    title: String, required
    description: String
    content : String, required
    active: Boolean, required default false
    mainImageUrl : String
    creatorName: String, required
    creatorId: String, required
    createdAt : Date, required
    lastModify : Date, required

###### get report
    path: /report
    method: get
    query: id, title, active, creatorId, creatorName
    return: 200 - [reports] || 4-- errorMessage

###### create report
    path: /report
    method: post
    headers: authorization
    body: title, description, content, active, mainMediaUrl
    return: 200 - {message} || 4-- errorMessage

###### update report
    path: /report
    method: put
    headers: authorization
    body: title, description, content, active, mainMediaUrl
    return: 200 - {message} || 4-- errorMessage

###### delete report
    path: /report
    method: delete
    headers: authorization
    body: reportid
    return: 200 - {message} || 4-- errorMessage