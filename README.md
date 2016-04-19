# InternalGarageSystem
The portion of the website that controls device registration, and activation

## Todo list

- [x] DeviceModel
  - Won't be able to test in real implementations
  - [x] Define the interface for a generic device (refer to the reports)
- [x] DeviceOrchestrator (DO)
  - [x] Define a composer that runs devices in a certain pattern
  - [ ] Have the ability to have multiple sequences running at the same time.
  - [ ] Define events specific to tripping the next seqence in the DO.
- [x] GarageModel
  - Make sure that the theoretical reservedTimes are the same as the physicall spaces occupied.
  - [ ] Build an experimental and theoretical model of the garage.
      - This will be tightly coupled to the device model.
      - This will be used to handle exceptions, and send information to the reservation system.
- [ ] Make both garage models persistent 

# IMPORTANT

When running the code, run with:

```
npm run prod
```

When development, make sure that `nodemon` is installed, and run an `npm install`

```
npm run dev
```


## Event System Specification

When connecting a device (html view) to the event system, you must vist the path `/device/:deviceType`. When visiting this page, you have the ability register the current device type with the event system. You must enter a unique name, or the system might run into a failure.

### Event Sequence Speicification

#### Server

On the server-side of the application, we do not directive interface with the Socket.IO api. It is done so using the API that the DeviceOrchestrator exposes. Doing this allowed us to hide the complexity of composing events in a 

#### Client Side







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
