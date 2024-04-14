<template>
    <div class="container text-left">
        <div class="row">
            <div class="col">
                <!--Columna vacia-->
                <h1>xddd</h1>
            </div>
            <div class="col">
                <h4>Nombre del producto:</h4>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control i" id="nombreProducto" placeholder="" required>
                    <label for="floatingInput">Ingrese el nombre</label>
                    <div class="invalid-feedback">
                        Por favor digite en el area de texto.
                    </div>
                </div>

                <h4>Descripcion del producto:</h4>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="descripcionProducto" placeholder="" required>
                    <label for="floatingInput">Ingrese la descripcion.</label>
                    <div class="invalid-feedback">
                        Por favor digite en el area de texto.
                    </div>
                </div>
                <h4>Precio del producto:</h4>
                <div class="input-group mb-3">
                    <span class="input-group-text">$</span>
                    <input type="text" class="form-control " id="precioProducto"
                        placeholder="Ingrese la cantidad"
                        aria-label="Dollar amount (with dot and two decimal places)" required>

                    <div class="invalid-feedback">
                        Por favor digite en el area de texto.
                    </div>
                </div>

                <div class="form-floating">
                    <h4>Tipo de producto:</h4>
                    <select class="form-select" id="tipoProducto" aria-label="Floating label select example" required>
                        <option selected disabled>Elija una opcion</option>
                        <option value="1">Postre</option>
                        <option value="2">Bebida caliente</option>
                        <option value="3">Bebida fria</option>
                    </select>
                    <div class="invalid-feedback">
                        Por favor elija una opcion.
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="prevImagen">
                    <label for="formFile" required class="form-label">Seleccione imagen:</label>
                    <input class="form-control" type="file" id="seleccionarImagen" @change="previewImage">

                    <div class="invalid-feedback">
                        Por favor elija una imagen.
                    </div>
                    <img id="imagenPrevista" src="#" alt="Vista previa de la imagen" style="max-width: 100%; display: none;">
                </div>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <div class="container text-center">
                    <div class="row">
                        <div class="col">
                            <button type="submit" id="btnCrearProducto"
                                class="btn btn-outline-success btn-lg">Crear</button>
                        </div>
                        <div class="col">
                            <!--Columna vacia-->
                        </div>
                        <div class="col">
                            <button type="submit" class="btn btn-outline-danger btn-lg">Regresar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div>

    </div>

</template>
