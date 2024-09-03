import { Dropdown } from "bootstrap";
import { Toast, validarFormulario } from "../funciones";
import Swal from "sweetalert2";
import DataTable from "datatables.net-bs5";
import { lenguaje } from "../lenguaje";


const formulario = document.getElementById('FormProducto')
const tabla = document.getElementById('Tablita')
const BtnGuardar = document.getElementById('BtnGuardar')
const BtnModificar = document.getElementById('BtnModificar')
const BtnCancelar = document.getElementById('BtnCancelar')

let contador = 1;
const datatable = new DataTable('#Tablita', {
    data: null,
    language: lenguaje,
    pageLength: '15',
    lengthMenu: [3, 9, 11, 25, 100],
    columns: [
        {
            title: 'No.',
            data: 'id',
            width: '2%',
            render: (data, type, row, meta) => {
                // console.log(meta.ro);
                return meta.row + 1;
            }
        },
        {
            title: 'Nombre',
            data: 'prod_nombre'
        },
        {
            title: 'Precio',
            data: 'prod_precio'
        },
        {
            title: 'Acciones',
            data: 'prod_id',
            searchable: false,
            orderable: false,
            render: (data, type, row, meta) => {
                let html = `
                <button class='btn btn-warning modificar' data-prod_id="${data}" data-prod_nombre="${row.prod_nombre}" data-prod_precio="${row.prod_precio}" data-saludo="hola mundo"><i class='bi bi-pencil-square'></i>Modificar</button>
                <button class='btn btn-danger eliminar' data-prod_id="${data}">Eliminar</button>

                `
                return html;
            }
        },

    ]
})

BtnModificar.parentElement.style.display = 'none'
BtnModificar.disabled = true
BtnCancelar.parentElement.style.display = 'none'
BtnCancelar.disabled = true

const guardar = async (e) => {
    e.preventDefault()

    if (!validarFormulario(formulario, ['prod_id'])) {
        Swal.fire({
            title: "Campos vacios",
            text: "Debe llenar todos los campos",
            icon: "info"
        })
        return
    }

    try {
        const body = new FormData(formulario)
        const url = "/NEW-MVC2024/API/producto/guardar"
        const config = {
            method: 'POST',
            body
        }

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje, detalle } = data;
        let icon = 'info'
        if (codigo == 1) {
            icon = 'success'
            formulario.reset();
            Buscar();
        } else {
            icon = 'error'
            console.log(detalle);
        }

        Toast.fire({
            icon: icon,
            title: mensaje
        })

    } catch (error) {
        console.log(error);
    }
}


const Buscar = async () => {
    try {
        const url = "/NEW-MVC2024/API/producto/buscar"
        const config = {
            method: 'GET',
        }

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje, detalle, datos } = data;

        // tabla.tBodies[0].innerHTML = ''
        // const fragment = document.createDocumentFragment();
        console.log(datos);
        datatable.clear().draw();

        if (datos) {
            datatable.rows.add(datos).draw();
        }
        // if (codigo == 1) {
        //     let counter = 1;
        //     datos.forEach(producto => {
        //         const tr = document.createElement('tr');
        //         const td1 = document.createElement('td');
        //         const td2 = document.createElement('td');
        //         const td3 = document.createElement('td');
        //         const td4 = document.createElement('td');
        //         const buttonModificar = document.createElement('button');
        //         const buttonEliminar = document.createElement('button');
        //         td1.innerText = counter
        //         td2.innerText = producto.nombre
        //         td3.innerText = producto.precio

        //         buttonModificar.classList.add('btn', 'btn-warning')
        //         buttonEliminar.classList.add('btn', 'btn-danger')
        //         buttonModificar.innerText = 'Modificar'
        //         buttonEliminar.innerText = 'Eliminar'

        //         buttonModificar.addEventListener('click', () => traerDatos(producto))
        //         buttonEliminar.addEventListener('click', () => eliminar(producto))

        //         td4.appendChild(buttonModificar)
        //         td4.appendChild(buttonEliminar)

        //         counter++

        //         tr.appendChild(td1)
        //         tr.appendChild(td2)
        //         tr.appendChild(td3)
        //         tr.appendChild(td4)
        //         fragment.appendChild(tr)
        //     })
        // } else {
        //     const tr = document.createElement('tr');
        //     const td = document.createElement('td');
        //     td.innerText = "No hay productos"
        //     td.colSpan = 4

        //     tr.appendChild(td)
        //     fragment.appendChild(tr)
        // }

        // tabla.tBodies[0].appendChild(fragment)

    } catch (error) {
        console.log(error);
    }
}
Buscar();

const traerDatos = (e) => {
    const elemento = e.currentTarget.dataset

    formulario.prod_id.value = elemento.prod_id
    formulario.prod_nombre.value = elemento.prod_nombre
    formulario.prod_precio.value = elemento.prod_precio
    tabla.parentElement.parentElement.style.display = 'none'

   BtnGuardar.parentElement.style.display = 'none'
   BtnGuardar.disabled = true
   BtnModificar.parentElement.style.display = ''
   BtnModificar.disabled = false
   BtnCancelar.parentElement.style.display = ''
   BtnCancelar.disabled = false
}

const cancelar = () => {
    tabla.parentElement.parentElement.style.display = ''
    formulario.reset();
   BtnGuardar.parentElement.style.display = ''
   BtnGuardar.disabled = false
   BtnModificar.parentElement.style.display = 'none'
   BtnModificar.disabled = true
   BtnCancelar.parentElement.style.display = 'none'
   BtnCancelar.disabled = true
}

const modificar = async (e) => {
    e.preventDefault()

    if (!validarFormulario(formulario)) {
        Swal.fire({
            title: "Campos vacios",
            text: "Debe llenar todos los campos",
            icon: "info"
        })
        return
    }

    try {
        const body = new FormData(formulario)
        const url = "/NEW-MVC2024/API/producto/modificar"
        const config = {
            method: 'POST',
            body
        }

        const respuesta = await fetch(url, config);
        const data = await respuesta.json();
        const { codigo, mensaje, detalle } = data;
        console.log(data);
        let icon = 'info'
        if (codigo == 1) {
            icon = 'success'
            formulario.reset();
            Buscar();
            cancelar();
        } else {
            icon = 'error'
            console.log(detalle);
        }

        Toast.fire({
            icon: icon,
            title: mensaje
        })

    } catch (error) {
        console.log(error);
    }
}


//funcion eliminar 
const eliminar = async (e) => {
    const id = e.currentTarget.dataset.prod_id
    let confirmacion = await Swal.fire({
        icon: 'question',
        title: 'Confirmacion',
        text: '¿Esta seguro que desea eliminar este registro?',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        // input: 'text'
    })
    console.log(confirmacion);
    if (confirmacion.isConfirmed) {
        try {
            const body = new FormData()
            body.append('id', id)
            const url = "/NEW-MVC2024/API/producto/eliminar"
            const config = {
                method: 'POST',
                body
            }

            const respuesta = await fetch(url, config);
            const data = await respuesta.json();
            const { codigo, mensaje, detalle } = data;
            let icon = 'info'
            if (codigo == 1) {
                icon = 'success'
                formulario.reset();
                Buscar();
            } else {
                icon = 'error'
                console.log(detalle);
            }

            Toast.fire({
                icon: icon,
                title: mensaje
            })
        } catch (error) {
            console.log(error);
        }
    }

}

formulario.addEventListener('submit', guardar)
BtnCancelar.addEventListener('click', cancelar)
BtnModificar.addEventListener('click', modificar)
datatable.on('click', '.modificar', traerDatos)
datatable.on('click', '.eliminar', eliminar)