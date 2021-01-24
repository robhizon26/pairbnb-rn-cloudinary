class Place {
  constructor(id, title, description, imageUrl, price, availableFrom, availableTo, userId, location) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
    this.availableFrom = availableFrom;
    this.availableTo = availableTo;
    this.userId = userId;
    this.location = location;
  }
}

export default Place;
