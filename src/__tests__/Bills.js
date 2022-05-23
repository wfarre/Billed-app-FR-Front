/**
 * @jest-environment jsdom
 */

 import '@testing-library/jest-dom'

import {getAllByTestId, getByRole, getByTestId, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";
import NewBillUI from "../views/NewBillUI"
import Actions from "../views/Actions"
// import handleClickIconEye from "../containers/Bills"
import Bills from "../containers/Bills";

jest.mock("../app/store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList).toContain(`active-icon`);


    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      // console.log(screen);
      // console.log(document.body.innerHTML);
      expect(dates).toEqual(datesSorted)
    })
    test("I click on new bill button and it redirect on new bill page", async () => {
      // my test 
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      userEvent.click(
        getByTestId(document.body, "btn-new-bill")
        )
        router()
        window.onNavigate(ROUTES_PATH["NewBill"])

        await waitFor(() => screen.getByText("Envoyer une note de frais"))
        
    })
    test("I click on the eye icon, the picture of the bill should be displayed", () => {
      // const root = document.createElement("div")
      // root.setAttribute("id", "root")
      // document.body.append(root)
      // router()
      // window.onNavigate(ROUTES_PATH.Bills)
      // // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // // window.localStorage.setItem('user', JSON.stringify({
      // //   type: 'Employee'
      // // }))
      // // document.body.innerHTML = Bills
      // // const onNavigate = (pathname) => {
      // //   document.body.innerHTML = ROUTES({ pathname })
      // // }
      // // const store = null
      // // const billspage = new Bills({
      // //   document, onNavigate, store, bills, localStorage: window.localStorage
      // // })

      // // const billspage = new Bills({
      // //   document, onNavigate, store: null, bills, localStorage: window.localStorage
      // // })

      // // const handleClickIconEye = jest.fn(handleClickIconEye)

      // const eyeBtn = getAllByTestId(document.body,"icon-eye")
      

      // // eyeBtn.forEach( eye => {
      // //   eye.addEventListener("click", handleClickIconEye)
      // //   userEvent.click(
      // //     eye
      // //   )
      // // })

      // // eyeBtn[1].addEventListener("click", handleClickIconEye(eyeBtn[1]))
      // userEvent.click(eyeBtn[1])

      // expect(handleClickIconEye).toHaveBeenCalled()

      // const modale = screen.getByRole("dialog");

      // expect(modale).toBeTruthy();

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      // document.body.innerHTML = DashboardFormUI(bills[0])
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const dashboard = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })

      const handleClickIconEye = jest.fn(dashboard.handleClickIconEye)
      const eyes = screen.getAllByTestId('icon-eye')
      eyes.forEach( eye => {
        eye.addEventListener('click', handleClickIconEye(eye))
        userEvent.click(eye)
        expect(handleClickIconEye).toHaveBeenCalled()
        const modale = screen.getByTestId('modaleFileAdmin')
      expect(modale).toBeTruthy()
      })
      

      
    })
  })
})





/// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      // const contentPending  = await screen.getByText("En attente (1)")
      // expect(contentPending).toBeTruthy()
      // const contentRefused  = await screen.getByText("Refusé (2)")
      // expect(contentRefused).toBeTruthy()
      // expect(screen.getByTestId("big-billed-icon")).toBeTruthy()
    })
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      console.log(message);
      expect(message).toBeTruthy()
    })
  })

  })
})



