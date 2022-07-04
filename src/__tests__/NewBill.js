/**
 * @jest-environment jsdom
 */

import {
  fireEvent,
  getByTestId,
  screen,
  wait,
  waitFor
} from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import router from "../app/Router.js";
import {
  ROUTES_PATH
} from "../constants/routes.js";
import "@testing-library/jest-dom";
import {
  localStorageMock
} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import userEvent from "@testing-library/user-event";
import {
  checkIfFileTypeIsValid,
  returnRightFile
} from "../containers/NewBill.js";






// test unitaire
describe("Given I upload a picture", () => {
  describe("When the picture is at the wrong format", () => {
    test("Then the file is not valid", () => {
      expect(checkIfFileTypeIsValid("toto.txt")).toBe(false);
    })
    test("Then it should throw an error", () => {
      function wrongFile() {
        returnRightFile("toto.txt");
      }
      expect(wrongFile).toThrowError(new Error('wrong format: please send an image with the right format (jpg, jpeg or png) format'))
    })
  })
  describe("When the picture is at the right format", () => {
    test("Then the file is valid", () => {
      expect(checkIfFileTypeIsValid("toto.jpg")).toBe(true);

    })
    test("Then it should return the name of the file", () => {
      expect(returnRightFile("toto.jpg")).toBe("toto.jpg")
      expect(returnRightFile("toto.jpeg")).toBe("toto.jpeg")
      expect(returnRightFile("toto.png")).toBe("toto.png")
      expect(returnRightFile("toto.png")).not.toBe("toto.txt");
      expect(returnRightFile("toto.jpg")).not.toBe("gertrude.jpg")
    })
  })
})

// I test what should appear on the page 
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the text 'Envoyer une note de frais' should appear", () => {
      // const html = NewBillUI()
      // document.body.innerHTML = html
      //to-do write assertion


      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);

      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();

    });
    test("Then the mail icon in the vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);

      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      //to-do write expect expression
      expect(mailIcon.classList).toContain(`active-icon`);
    });
    test("Then the new bill form should appear", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);

      await waitFor(() => screen.getByTestId("form-new-bill"));
      const form = screen.getByTestId("form-new-bill");
      expect(form).toBeTruthy();
      expect(form).toMatchInlineSnapshot(`
        <form
          data-testid="form-new-bill"
        >
          
                    
          <div
            class="row"
          >
            
                        
            <div
              class="col-md-6"
            >
              
                          
              <div
                class="col-half"
              >
                
                            
                <label
                  class="bold-label"
                  for="expense-type"
                >
                  Type de dépense
                </label>
                
                              
                <select
                  class="form-control blue-border"
                  data-testid="expense-type"
                  required=""
                >
                  
                                
                  <option>
                    Transports
                  </option>
                  
                                
                  <option>
                    Restaurants et bars
                  </option>
                  
                                
                  <option>
                    Hôtel et logement
                  </option>
                  
                                
                  <option>
                    Services en ligne
                  </option>
                  
                                
                  <option>
                    IT et électronique
                  </option>
                  
                                
                  <option>
                    Equipement et matériel
                  </option>
                  
                                
                  <option>
                    Fournitures de bureau
                  </option>
                  
                              
                </select>
                
                          
              </div>
              
                          
              <div
                class="col-half"
              >
                
                            
                <label
                  class="bold-label"
                  for="expense-name"
                >
                  Nom de la dépense
                </label>
                
                            
                <input
                  class="form-control blue-border"
                  data-testid="expense-name"
                  placeholder="Vol Paris Londres"
                  type="text"
                />
                
                          
              </div>
              
                          
              <div
                class="col-half"
              >
                
                            
                <label
                  class="bold-label"
                  for="datepicker"
                >
                  Date
                </label>
                
                            
                <input
                  class="form-control blue-border"
                  data-testid="datepicker"
                  required=""
                  type="date"
                />
                
                          
              </div>
              
                          
              <div
                class="col-half"
              >
                
                            
                <label
                  class="bold-label"
                  for="amount"
                >
                  Montant TTC 
                </label>
                
                            
                <input
                  class="form-control blue-border input-icon input-icon-right"
                  data-testid="amount"
                  placeholder="348"
                  required=""
                  type="number"
                />
                
                          
              </div>
              
                          
              <div
                class="col-half-row"
              >
                
                            
                <div
                  class="flex-col"
                >
                   
                              
                  <label
                    class="bold-label"
                    for="vat"
                  >
                    TVA
                  </label>
                  
                              
                  <input
                    class="form-control blue-border"
                    data-testid="vat"
                    placeholder="70"
                    type="number"
                  />
                  
                            
                </div>
                
                            
                <div
                  class="flex-col"
                >
                  
                              
                  <label
                    class="white-text"
                    for="pct"
                  >
                    %
                  </label>
                  
                              
                  <input
                    class="form-control blue-border"
                    data-testid="pct"
                    placeholder="20"
                    required=""
                    type="number"
                  />
                  
                            
                </div>
                
                          
              </div>
              
                        
            </div>
            
                        
            <div
              class="col-md-6"
            >
              
                          
              <div
                class="col-half"
              >
                
                            
                <label
                  class="bold-label"
                  for="commentary"
                >
                  Commentaire
                </label>
                
                            
                <textarea
                  class="form-control blue-border"
                  data-testid="commentary"
                  rows="3"
                />
                
                          
              </div>
              
                          
              <div
                class="col-half"
              >
                
                            
                <label
                  class="bold-label"
                  for="file"
                >
                  Justificatif
                </label>
                
                            
                <input
                  class="form-control blue-border"
                  data-testid="file"
                  required=""
                  type="file"
                />
                
                          
              </div>
              
                        
            </div>
            
                    
          </div>
          
                    
          <div
            class="row"
          >
            
                      
            <div
              class="col-md-6"
            >
              
                        
              <div
                class="col-half"
              >
                
                          
                <button
                  class="btn btn-primary"
                  id="btn-send-bill"
                  type="submit"
                >
                  Envoyer
                </button>
                
                        
              </div>
              
                      
            </div>
            
                    
          </div>
          
                  
        </form>
      `);
    });

  })
})


describe("Given I am connected as an employee", () => {
  describe("Given I am on the NewBillPage", () => {
    describe("When the user is uploading a picture", () => {
      test("Then it should throw an error if the format is not correct (different from JPEG, JPG, PNG)", async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill);

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage
        })

        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

        const file = screen.getByTestId('file')
        file.addEventListener("change", handleChangeFile)
        fireEvent.change(file, {
          target: {
            files: [new File(['(⌐□_□)'], 'chucknorris.txt', {
              type: 'text/txt'
            })]
          }
        })
        expect(handleChangeFile).toHaveBeenCalled();
        expect(handleChangeFile).toThrowError(Error);
      })
      test("Then it should accept the file if the format is correct (JPEG, JPG, PNG)", async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.NewBill);

        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage
        })

        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

        const file = screen.getByTestId('file')
        file.addEventListener("change", handleChangeFile)
        fireEvent.change(file, {
          target: {
            files: [new File(['(⌐□_□)'], 'chucknorris.png', {
              type: 'image/png'
            })]
          }
        })
        expect(handleChangeFile).toHaveBeenCalled();
        expect(handleChangeFile).toBeTruthy();
      })
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("Given I am on the NewBillPage", () => {
    describe('Given the user submits a new bill', () => {
      describe('Given the picture format is correct', () => {
        test('Then it should add the new bill to the other bills and return to the homepage', async () => {
          Object.defineProperty(window, "localStorage", {
            value: localStorageMock,
          });
          window.localStorage.setItem(
            "user",
            JSON.stringify({
              type: "Employee",
            })
          );
          const root = document.createElement("div");
          root.setAttribute("id", "root");
          document.body.append(root);
          router();
          window.onNavigate(ROUTES_PATH.NewBill);


          const newBill = new NewBill({
            document,
            onNavigate,
            store: mockStore,
            localStorage: window.localStorage
          })


          const formNewBill = screen.getByTestId('form-new-bill')

          const type = screen.getByTestId('expense-type')
          fireEvent.change(type, {
            target: {
              value: "Transports"
            }
          });
          expect(type.value).toBe("Transports");

          const name = screen.getByTestId('expense-name')
          fireEvent.change(name, {
            target: {
              value: "Vol Paris-Madrid"
            }
          });
          expect(name.value).toBe("Vol Paris-Madrid");

          const amount = screen.getByTestId('amount')
          fireEvent.change(amount, {
            target: {
              value: 345
            }
          });
          expect(amount.value).toBe("345");

          const date = screen.getByTestId('datepicker')
          fireEvent.change(date, {
            target: {
              value: "2020-03-01"
            }
          });
          expect(date.value).toBe("2020-03-01");

          const vat = screen.getByTestId('vat')
          fireEvent.change(vat, {
            target: {
              value: 20
            }
          });
          expect(vat.value).toBe("20");

          const pct = screen.getByTestId('pct')
          fireEvent.change(pct, {
            target: {
              value: 2
            }
          });
          expect(pct.value).toBe("2");

          const commentary = screen.getByTestId('commentary')
          fireEvent.change(commentary, {
            target: {
              value: "pasunemail"
            }
          });
          expect(commentary.value).toBe("pasunemail")

          const file = screen.getByTestId('file')
          fireEvent.change(file, {
            target: {
              files: [new File(['(⌐□_□)'], 'chucknorris.png', {
                type: 'image/png'
              })]
            }
          })

          const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))

          formNewBill.addEventListener("submit", handleSubmit)
          fireEvent.submit(formNewBill)

          expect(handleSubmit).toHaveBeenCalled();
          expect(handleSubmit).toBeTruthy();

          router()
          window.onNavigate(ROUTES_PATH["Bills"]);

          await waitFor(() => screen.getByTestId('icon-window'))
          const windowIcon = screen.getByTestId('icon-window')
          expect(windowIcon.classList).toContain(`active-icon`);

        })
      })
    })
  })
})

// Post 
describe("Given I am connected as an employee", () => {
  describe("When I submit a new bill", () => {
    test("Then it should be created in the store", async () => {
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      })

      const handleSubmit = jest.fn(e => newBill.handleSubmit(e))
      const handleChangeFile = jest.fn(e => newBill.handleChangeFile(e))

      const update = jest.fn(mockStore.bills().update);
      const create = jest.fn(mockStore.bills().create);


      const type = screen.getByTestId('expense-type')
      fireEvent.change(type, {
        target: {
          value: "Transports"
        }
      });
      expect(type.value).toBe("Transports");

      const name = screen.getByTestId('expense-name')
      fireEvent.change(name, {
        target: {
          value: "Vol Paris-Madrid"
        }
      });
      expect(name.value).toBe("Vol Paris-Madrid");

      const amount = screen.getByTestId('amount')
      fireEvent.change(amount, {
        target: {
          value: 345
        }
      });
      expect(amount.value).toBe("345");

      const date = screen.getByTestId('datepicker')
      fireEvent.change(date, {
        target: {
          value: "2020-03-01"
        }
      });
      expect(date.value).toBe("2020-03-01");

      const vat = screen.getByTestId('vat')
      fireEvent.change(vat, {
        target: {
          value: 20
        }
      });
      expect(vat.value).toBe("20");

      const pct = screen.getByTestId('pct')
      fireEvent.change(pct, {
        target: {
          value: 2
        }
      });
      expect(pct.value).toBe("2");

      const commentary = screen.getByTestId('commentary')
      fireEvent.change(commentary, {
        target: {
          value: "pasunemail"
        }
      });
      expect(commentary.value).toBe("pasunemail")

      const file = screen.getByTestId('file')
      file.addEventListener("change", handleChangeFile)
      fireEvent.change(file, {
        target: {
          files: [new File(['(⌐□_□)'], 'chucknorris.png', {
            type: 'image/png'
          })]
        }
      })

      expect(handleChangeFile).toHaveBeenCalled()

      const bill = await create();
      expect(create).toHaveBeenCalled();
      expect(bill.fileUrl).toBe('https://localhost:3456/images/test.jpg');
      expect(bill.key).toBe('1234');

      const uploadedBill = {
        email: "a@a",
            type: "Transports",
            name: "Vol Paris-Madrid",
            amount: 345,
            date: "2020-03-01",
            vat: 20,
            pct: 2,
            commentary: "pasunemail",
            fileName: 'chucknorris.jpg',
            status: 'pending',
            fileUrl: bill.fileUrl,
            key: bill.key
      }

      const formNewBill = screen.getByTestId('form-new-bill');




      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();

      const billToUpdate = await update(uploadedBill);

      expect(update).toHaveBeenCalled();
      expect(billToUpdate.fileUrl).toBe("https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a")
      expect(update).toHaveBeenCalledWith({
        email: "a@a",
        type: "Transports",
        name: "Vol Paris-Madrid",
        amount: 345,
        date: "2020-03-01",
        vat: 20,
        pct: 2,
        commentary: "pasunemail",
        fileName: 'chucknorris.jpg',
        status: 'pending',
        fileUrl: "https://localhost:3456/images/test.jpg",
        key: "1234",
      });
    })
  })
})