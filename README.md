# InternalGarageSystem
The potion of the website that controls device registration, and activation

# IMPORTANT

When running the code, run with:

```
npm run prod
```

When development, make sure that `nodemon` is installed, and run an `npm install`

```
npm run dev
```



## Todo list

- [x] DeviceModel
  - [x] Define the interface for a generic device (refer to the reports)
- [x] DeviceController
  - [ ] Define a composer that runs devices in a certain pattern
- [x] GarageModel
  - Make sure that the theoretical reservedTimes are the same as the physicall spaces occupied.
- [x] Sequence a DS that iterates when a certain payload is received


### GarageModel

There should be two garage instances, one that directly interfaces with the device models, and the other that is use for the reservation system. The one that is based off the sensors in the garage is used to determine if someone parked in the wrong location, or is in the garage without permission. **elaborate**




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
