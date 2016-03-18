# InternalGarageSystem
The potion of the website that controls device registration, and activation

## Todo list

- [ ] DeviceModel
  - [ ] Define the interface for a generic device (refer to the reports)
- [ ] DeviceController
  - [ ] Define a composer that runs devices in a certain pattern



### REST API Specification

For the first demo, there is no need for oauth2, since we will only have one garage in place, but when the second demo comes we will have to pass a token to the garage api to show that the reservation system is valid, and not someone else trying to use the system.

To check if the garage is full.

```
get "/api/b/full" => boolean
```

To reserve a spot in the garage
```
post "/api/o/reserve?start=<daterep>&finish=<daterep>"
```
