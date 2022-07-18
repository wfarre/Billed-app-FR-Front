import {
  ROUTES_PATH
} from '../constants/routes.js'
import Logout from "./Logout.js"

// /* we check if the file as the right extension JPEG JPG PNG */
// export function checkIfFileTypeIsValid(file) {

//   /* we get the extension from the file */
//   function getExtension(filename) {
//     const ext = filename.split('.');
//     return ext[ext.length - 1].toLowerCase();
//   }

//   const validFileTypes = ['jpeg', 'jpg', 'png'];

//   let isValid = false;
//   console.log(file);
//   const extension = getExtension(file)
//   console.log(extension);
//   validFileTypes.map(type => {
//     if (extension === type) {
//       return isValid = true;
//     }
//   })
//   return isValid;
// }


// export function returnRightFile(fileName, input) {
//   if (checkIfFileTypeIsValid(fileName)) {
//     return fileName;
//   } else {
//     input.value = null;
//     throw new Error('wrong format: please send an image with the right format (jpg, jpeg or png) format')
//   }
// }

export default class NewBill {
  constructor({
    document,
    onNavigate,
    store,
    localStorage
  }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({
      document,
      localStorage,
      onNavigate
    })
  }

/**
 * we check if the file as the right extension JPEG JPG PNG 
 **/
  checkIfFileTypeIsValid(file) {

    /* we get the extension from the file */
    function getExtension(filename) {
      const ext = filename.split('.');
      return ext[ext.length - 1].toLowerCase();
    }
  
    const validFileTypes = ['jpeg', 'jpg', 'png'];
  
    let isValid = false;
    console.log(file);
    const extension = getExtension(file)
    console.log(extension);
    validFileTypes.map(type => {
      if (extension === type) {
        return isValid = true;
      }
    })
    return isValid;
  }

  /**
   * we get the extension from the file 
   **/
  returnRightFile(fileName, input) {
    if (this.checkIfFileTypeIsValid(fileName)) {
      return fileName;
    } else {
      input.value = null      
      throw new Error('wrong format: please send an image with the right format (jpg, jpeg or png) format')
    }
  }

  handleChangeFile = e => {

    e.preventDefault()
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const filePath = e.target.value.split(/\\/g)
    const fileName = filePath[filePath.length - 1]

    const formData = new FormData()
    const email = JSON.parse(localStorage.getItem("user")).email
    formData.append('file', file)
    formData.append('email', email)

    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true
        }
      })
      .then(({
        fileUrl,
        key
      }) => {
        this.billId = key
        this.fileUrl = fileUrl
        this.fileName = this.returnRightFile(fileName,  e.target);
      }).catch(error => console.error(error))
  }

  handleSubmit = e => {
    e.preventDefault()

    

    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    console.log(bill);
    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])

  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({
          data: JSON.stringify(bill),
          selector: this.billId
        })
        .then(() => {
          this.onNavigate(ROUTES_PATH['Bills'])
        })
        .catch(error => console.error(error))
    }
  }
}