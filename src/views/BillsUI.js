import VerticalLayout from './VerticalLayout.js'
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"

import Actions from './Actions.js'

const row = (bill) => {
  return (`
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `)
}

const rows = (data) => {
  return (data && data.length) ? data.map(bill => row(bill)).join("") : ""
}


function organizeByDate(array){
  const antiChrono = (a, b) => Date.parse(a.date) < Date.parse(b.date) ? 1 : -1;
  return [...array].sort(antiChrono)
}

export default ({
  data: bills,
  loading,
  error
}) => {


  const modal = () => (`
    <div class="modal fade" id="modaleFile" tabindex="-1" data-testid="modaleFileAdmin" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `)

  if (loading) {
    return LoadingPage()
  } else if (error) {
    return ErrorPage(error)
  }

  if(bills){
    bills = organizeByDate(bills);
  }
  // console.log(mybills);

  // function sayHello(){
  //   console.log("sayHello");
  // }

  // sayHello();
  // console.log("hello");
  // console.log(bills);

  // bills.map(bill => console.log(bill.dateNonFormated))
  // console.log(bills);
  // bills.map(bill => console.log(Date.parse(bill.date)));

  // console.log(Date.parse(bills[2].date));

  // const antiChrono = (a, b) => new Date(a.date) < new Date(b.date) ? 1 : -1;
  // bills.sort(antiChrono);
  

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'>Mes notes de frais</div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`)
}