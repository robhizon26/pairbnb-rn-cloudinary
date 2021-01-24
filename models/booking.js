class Booking {
  constructor(id, placeId, userId, placeTitle, placeImage, firstName, lastName, guestNumber, bookedFrom, bookedTo) {
    this.id = id;
    this.placeId = placeId;
    this.userId = userId;
    this.placeTitle = placeTitle;
    this.placeImage = placeImage;
    this.firstName = firstName;
    this.lastName = lastName;
    this.guestNumber = guestNumber;
    this.bookedFrom = bookedFrom;
    this.bookedTo = bookedTo;
  }
}

export default Booking;
