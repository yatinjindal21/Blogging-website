# fileuploader
File uploader component in Angular2 

## Installation

recommended way to install is through [npm](https://www.npmjs.com/package/fileuploader) package manager using the command: 
```bash
npm install fileuploader --save
```

## Documentation

### Inputs

- `type` (`string`) - used to identify how the files will be handled, currently only image has particular handling
- `cpntID` (`string`) - the id of the component, used to facilitate testing
- `accepted` (`string`) - a string that dictates which types of archives will show up on the upload dialog
- `maxSize` (`number`) - the maximum size a file can have to be allowed, expressed in bytes i.e: 1000 = 1 kb
- `multiple` (`boolean`) - if the component will take multiple files, default is true
- `encode` (`boolean`) - if the component will generate a base64 string of the uploaded files, default false
- `invalidFilemsg` (`string`) - used to show the alerts for files that failed to load, default is "Invalid File", ": " is added automatically
- `invalidFormatmsg` (`string`) - used to show the alerts for invalid format, default is "Invalid Format", used for images mainly

### Outputs

- `results` : currently only used for image type inputs
- `fail` : A string containing the names of all files that couldn't be uplaoded, normally caused if the file is over the maxSize

### Fields

- `files` (`File[]`) : holds the files uploaded to the component, used if the multiple input is set to true
- `mFile` (`File`) : holds the single file uploaded, used when multiple is set to false
- `encoded` (`string[]`) : holds the base64 of all files uploaded to the component, empty if encode = false
- `failed` (`string[]`) : holds the names of all files that failed to upload;

### Snippets

Below is an example of a basic template, it can also be found in the snippets folder;

```html
<div class="mt-4" style="height:360px;">
    <uploader #uploader (results)="handleResults($event)" [cpntID]="'input_add_files'" [accepted]="'.xml,.zip'">
        <uploader-without-file>
            <div class="text-md-center">
                <h5 class="pt-3">Drag your files here</h5>
                <div class="mt-3">
                    <a class="btn btn-secondary" id="button_add_files" (click)="uploader.addFiles()">Select the files</a>
                </div>
                <div class="mt-3">
                    <b>Atention:</b> Only XML or ZIP files are accepted.
                </div>
            </div>
        </uploader-without-file>
        <uploader-with-file>
            <ul class="list-group">
                <li class="list-group-item" *ngFor="let f of uploader.files">
                    <small>{{f.size / 1024 | number : '1.0-0'}} KB</small> &nbsp;&nbsp;&nbsp; {{f.name}}
                    <a class="clickable float-md-right" id="button_delete_file" (click)="deleteFile(f)">
                        X
                    </a>
                </li>
            </ul>
        </uploader-with-file>
    </uploader>
</div>
```
