import { HomePage } from "../pages/home/home";
import { Component, ViewChild } from "@angular/core";
import { Platform, Config, Nav, MenuController, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { TranslateService } from "@ngx-translate/core";
import { LandingPage } from "../pages/landing/landing";
import { ProfilesProvider } from "../providers/profiles/profiles";
import { UserProvider } from "../providers/user/user";
import { User } from "./model/user";
import { AuthProvider } from "../providers/auth/auth";
import { AlertProvider } from "../providers/alert-service/alert-service";
import { Profile } from "./model/profile";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;
  userComp: string;
  rootPage: any;
  username: any;
  profileSelected: Profile;
  profiles: any;
  privatePages: Array<{ title: string; component: any; icon: string }>;
  user: User;
  label = "Perfil";

  constructor(
    public menu: MenuController,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private translate: TranslateService,
    private config: Config,
    public events: Events,
    public authProvider: AuthProvider,
    public profilesProvider: ProfilesProvider,
    public alertProvider: AlertProvider,
    public userProvider: UserProvider
  ) {
    // Controle d
    this.authProvider.isLoggedIn.subscribe(value => {
      if (!value && localStorage.getItem("token")) {
        this.validateAccess();
      }
    });

    this.userProvider.user.subscribe(user => {
      if (user instanceof User) {
        this.user = user;
        this.username = this.user.$shortName;
      }
    });
    this.profilesProvider.listProfiles.subscribe(profiles => {
      this.profiles = profiles;
      this.updateList();
    });
    this.profilesProvider.currentProfile.subscribe(profile => {
      if (profile instanceof Profile) {
        this.profileSelected = profile;
        this.updateList();
      }
    });
    this.userComp = "UserManagementPage";

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      if (this.authProvider.isLoggedIn.value) {
        this.userProvider
          .buildUser()
          .then(() => {
            this.setRoot();
          })
          .catch(() => {
            this.setRoot();
          });
      } else {
        this.setRoot();
      }
    });
    this.initTranslate();
  }

  setRoot() {
    // console.log(this.user instanceof User);
    // console.log(this.user.getProfiles().length);
    if (this.user instanceof User && this.user.getProfiles().length == 0) {
      this.rootPage = "UserManagementPage";
    } else if (localStorage.getItem("token")) {
      this.rootPage = HomePage;
    } else {
      this.rootPage = "LandingPage";
    }
  }

  initTranslate() {
    this.translate.setDefaultLang("pt-br");
    this.translate.get(["BACK_BUTTON_TEXT"]).subscribe(values => {
      this.config.set("ios", "backButtonText", values.BACK_BUTTON_TEXT);
    });
    this.config.set("tabsHideOnSubPages", true);
  }

  private changeSelected(): void {
    this.profilesProvider.currentProfile.next(this.profileSelected);
    this.updateList();
  }

  private updateList(): void {
    if (this.profileSelected) {
      if (this.profileSelected["profileType"] === "ProfileStudent") {
        this.label = "Perfil";
        this.privatePages = [
          { title: "INÍCIO", component: HomePage, icon: "home" },
          { title: "BOLETIM", component: "ReportPage", icon: "home" },
          { title: "AVALIAÇÃO", component: "ExamPage", icon: "home" },
          { title: "TAREFAS", component: "TaskPage", icon: "home" }
        ];
      } else if (this.profileSelected["profileType"] === "ProfileParent") {
        this.label = "Perfil";
        this.privatePages = [
          { title: "INÍCIO", component: HomePage, icon: "home" },
          { title: "BOLETIM", component: "ReportPage", icon: "home" },
          { title: "AVALIAÇÃO", component: "ExamPage", icon: "home" }
        ];
      } else if (this.profileSelected["profileType"] === "ProfileProfessor") {
        this.label = this.profileSelected.$showType;
        this.privatePages = [
          { title: "INÍCIO", component: HomePage, icon: "home" },
          { title: "BOLETIM", component: "ReportPage", icon: "home" },
          { title: "PLANEJAMENTO", component: "PlanningPage", icon: "home" },
          { title: "FREQUÊNCIA", component: "ClassroomPage", icon: "home" },
          { title: "AVALIAÇÃO", component: "ExamPage", icon: "home" },
          { title: "TURMA", component: "ClassroomDetailPage", icon: "home" },
          {
            title: "AUTORIZAÇÃO",
            component: "AuthorizationPage",
            icon: "home"
          }
        ];
      } else if (this.profileSelected["profileType"] === "ProfileSchool") {
        this.label = this.profileSelected.$showType;
        this.privatePages = [
          { title: "INÍCIO", component: HomePage, icon: "home" },
          { title: "TURMAS", component: "ClassroomListPage", icon: "home" },
          {
            title: "AUTORIZAÇÃO",
            component: "AuthorizationPage",
            icon: "home"
          }
        ];
        if (this.profileSelected["role"].type == "pedAdvisor") {
          this.privatePages.push({
            title: "AVALIAÇÕES",
            component: "AssestmentCheckPage",
            icon: "home"
          });
          this.privatePages.push({
            title: "PLANO DIÁRIO",
            component: "PlanningCheckPage",
            icon: "home"
          });
        }
      } else if (this.profileSelected["profileType"] === "ProfileCounty") {
        this.label = "Perfil";
        this.privatePages = [
          { title: "INÍCIO", component: HomePage, icon: "home" },
          {
            title: "AUTORIZAÇÃO",
            component: "AuthorizationPage",
            icon: "home"
          },
          { title: "ESCOLAS", component: "SchoolsPage", icon: "home" },
          { title: "PAPÉIS", component: "RolesPage", icon: "home" },
          { title: "PERMISSÕES", component: "PermissionsPage", icon: "home" }
        ];
      } else if (this.profileSelected["profileType"] === "ProfileComunity") {
        this.privatePages = [
          { title: "INÍCIO", component: HomePage, icon: "home" },
          { title: "HISTÓRICO", component: "HomePage", icon: "home" }
        ];
      }
    }
  }

  logout() {
    localStorage.clear();
    this.nav.setRoot(
      "LandingPage",
      {},
      {
        animate: true,
        direction: "back"
      }
    );
  }

  openPage(page) {
    this.nav.push(
      page,
      { profileSelected: this.profileSelected },
      {
        animate: true,
        direction: "forward"
      }
    );
  }

  validateAccess(): any {
    const alert = this.alertProvider.alertCtrl.create({
      title: "Login",
      message:
        "Sua sessão expirou. Informe sua senha para entrar de novo. Ao cancelar, você será desconectado da aplicação para novo login.",
      inputs: [
        {
          name: "login",
          placeholder: "Nome de Usuário",
          type: "text"
        },
        {
          name: "password",
          placeholder: "Password",
          type: "password"
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: data => {
            let confirmAlert = this.alertProvider.alertCtrl.create({
              title: "Deseja sair?",
              message:
                "Ao confirmar, você será direcionado para a tela de Apresentação para novo loging. Deseja continuar",
              buttons: [
                {
                  text: "Cancelar",
                  handler: () => {
                    this.authProvider.isLoggedIn.next(false);
                  }
                },
                {
                  text: "Sair",
                  handler: () => {
                    this.logout();
                  }
                }
              ]
            });
            confirmAlert.present();
          }
        },
        {
          text: "Login",
          handler: data => {
            if (data.password) {
              this.authProvider
                .signin({
                  shortName: data.login,
                  password: data.password
                })
                .then(res => {
                  console.log(res);
                  this.authProvider.isLoggedIn.next(true);
                })
                .catch(err => {
                  if (err.status === 401) {
                    let incorrectAlert = this.alertProvider.alertCtrl.create({
                      title: "Senha incorreta",
                      message:
                        "Insira sua senha novamente. Ao errar 3 vezes você será desconectado.",
                      buttons: [
                        {
                          text: "OK",
                          handler: data => {
                            this.authProvider.isLoggedIn.next(false);
                            this.userProvider.buildUser();
                          }
                        }
                      ]
                    });
                    incorrectAlert.present();
                  } else if (err.status === 404) {
                    let incorrectAlert = this.alertProvider.alertCtrl.create({
                      title: "Usuário não encontrado",
                      message:
                        "Não foi possível identificar seu nome de usuário. Desculpe-nos o transtorno, sugerimos que selecione 'Sair', para fazer nova autenticação via SMS, ou pode tentar novamente selecionando 'OK'",
                      buttons: [
                        {
                          text: "OK",
                          handler: () => {
                            this.authProvider.isLoggedIn.next(false);
                            this.userProvider.buildUser();
                          }
                        },
                        {
                          text: "Sair",
                          handler: () => {
                            this.logout();
                          }
                        }
                      ]
                    });
                    incorrectAlert.present();
                  }

                  console.error(err);
                });
              // logged in!
            } else {
              // invalid login
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }
}
