export class CreateCategoryDto {

  private constructor(
    public readonly name: string,
    public readonly available: boolean,
  ) {}


  static create( object: { [key: string]: any } ):[string?, CreateCategoryDto?] {

    const { name, available = false } = object;
    let availableBoolean = available;

    if ( !name ) return ['Missing name'];
    //! Hacemos una transformacion para available que desde la request viene como string, hay que trasnformarlo a boolean
    if ( typeof available !== 'boolean' ) {
      availableBoolean = ( available === 'true' )
    }
    //! Retornamos una instancia del dto CreateCategoryDto
    return [undefined, new CreateCategoryDto(name, availableBoolean)];

  }


}



