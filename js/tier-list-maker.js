'use strict';

let queuedImagesArray = [],
    storageForm = document.querySelector('.storage'),
    storageDiv = document.querySelector('.storage-box'),
    inputDiv = document.querySelector('.upload'),
    input = document.querySelector('.upload input');

const colors = ['#FF7F7F', '#FFBF7F', '#FFDF7F', '#BFFF7F', '#7FFF7F', '#7FBFFF', '#7F7FFF'],
    rows = document.querySelectorAll('.content-row');

const onDragStart = (event) => {
    event.dataTransfer.setData('id', event.target.parentNode.id);

    setTimeout(() => {
        event.target.style.visibility = 'hidden';
    }, 100);
};

const onDragEnd = (event) => {
    event.target.style.visibility = 'visible';
};

const displayQueuedImages = () => {
    let images = '';
    queuedImagesArray.forEach((image, index) => {
        images += `
        <div class="content-image" onclick="deleteImage(event)"
         draggable="true" id="${image.id}"ondragstart="onDragStart(event)" ondragend="onDragEnd(event)">
            <img width='100' height='100' style="pointerEvents:none;"src="${URL.createObjectURL(image)}"alt="image"/>
         </div>
        `;
    });

    storageDiv.innerHTML = images;
};

const deleteImage = (event) => {
    event.target.parentNode.remove();
};

input.addEventListener('change', () => {
    const files = input.files;
    for (let index = 0; index < files.length; index++) {
        const id = Date.now() + '' + index;
        files[index].id = id;
        queuedImagesArray.push(files[index]);
    }

    storageForm.reset();
    displayQueuedImages();
});

inputDiv.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
        if (!files[i].type.match('image')) return;
        if (queuedImagesArray.every((image) => image.name !== files[i].name)) queuedImagesArray.push(files[i]);
    }

    displayQueuedImages();
});

const onDragOver = (event) => {
    event.preventDefault();
};

const onDrop = (event) => {
    event.preventDefault();

    const draggedCardId = event.dataTransfer.getData('id', event.target.id);
    const draggedCard = document.getElementById(draggedCardId);
    event.target.appendChild(draggedCard);
    queuedImagesArray.splice(draggedCard, 1);
};

rows.forEach((row, index) => {
    const label = row.querySelector('.content-row-label');
    label.style.backgroundColor = colors[index];
    row.ondragover = onDragOver;
    row.ondrop = onDrop;
});
