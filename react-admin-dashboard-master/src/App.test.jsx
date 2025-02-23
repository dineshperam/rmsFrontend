// App.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import '@testing-library/jest-dom';
import ApiService from "./service/ApiService";
// import '@testing-library/jest-dom/extend-expect';

// Mock ApiService so we can control the authentication state
jest.mock("./service/ApiService", () => ({
  isAuthenticated: jest.fn(),
}));

// Mock Guard components to simply render the passed element
jest.mock("./service/Guard", () => ({
  AdminRoute: ({ element }) => element,
  ArtistRoute: ({ element }) => element,
  ManagerRoute: ({ element }) => element,
}));

// Mock route components so we can test route rendering easily
jest.mock("./components/common/LandingPage/LandingPage", () => () => (
  <div data-testid="LandingPage">LandingPage</div>
));
jest.mock("./components/common/Home/Home", () => () => (
  <div data-testid="Home">Home</div>
));
jest.mock("./pagesAuth/LoginPage/LoginPage", () => () => (
  <div data-testid="LoginPage">LoginPage</div>
));
jest.mock("./pagesAuth/ChangePassword/ChangePassword", () => () => (
  <div data-testid="ChangePassword">ChangePassword</div>
));
jest.mock("./pagesAuth/ForgotPassword/ForgotPassword", () => () => (
  <div data-testid="ForgotPassword">ForgotPassword</div>
));
jest.mock("./pagesAuth/ContactForm/ContactForm", () => () => (
  <div data-testid="ContactForm">ContactForm</div>
));
jest.mock("./components/common/UpdateProfile/UpdateProfilePage", () => () => (
  <div data-testid="UpdateProfilePage">UpdateProfilePage</div>
));

// Admin routes
jest.mock("./pagesAdmin/OverviewPage/OverviewPageAdmin", () => () => (
  <div data-testid="OverviewPageAdmin">OverviewPageAdmin</div>
));
jest.mock("./pagesAdmin/AllTransPage/AllTransPage", () => () => (
  <div data-testid="AllTransPage">AllTransPage</div>
));
jest.mock("./pagesAdmin/AllSongsPage/AllSongsPage", () => () => (
  <div data-testid="AllSongsPage">AllSongsPage</div>
));
jest.mock("./pagesAdmin/UsersPage/AllUsersPage", () => () => (
  <div data-testid="UsersPage">UsersPage</div>
));
jest.mock("./pagesAdmin/AddUsers/AddUsers", () => () => (
  <div data-testid="AddUsers">AddUsers</div>
));
jest.mock("./pagesAdmin/RoyaltiesPage/RoyaltiesPage", () => () => (
  <div data-testid="RoyaltiesPage">RoyaltiesPage</div>
));
jest.mock("./pagesAdmin/ContactRequestsPage/ContactRequestsPage", () => () => (
  <div data-testid="ContactRequestsPage">ContactRequestsPage</div>
));

// Artist routes
jest.mock("./pagesArtist/OverviewPageArtist/OverviewPageArtist", () => () => (
  <div data-testid="OverviewPageArtist">OverviewPageArtist</div>
));
jest.mock("./pagesArtist/ArtistSongsPage/ArtistSongsPage", () => () => (
  <div data-testid="ArtistSongsPage">ArtistSongsPage</div>
));
jest.mock("./pagesArtist/AllSongsPageArtist/AllSongsPageArtists", () => () => (
  <div data-testid="AllSongsPageArtist">AllSongsPageArtist</div>
));
jest.mock("./components/componentsArtist/AddSong/AddSongs", () => () => (
  <div data-testid="AddSong">AddSong</div>
));
jest.mock("./pagesArtist/ArtistTrans/ArtistTrans", () => () => (
  <div data-testid="ArtistTrans">ArtistTrans</div>
));
jest.mock("./pagesArtist/ArtistRequestsPage/ArtistRequestsPage", () => () => (
  <div data-testid="ArtistRequestsPage">ArtistRequestsPage</div>
));
jest.mock("./pagesArtist/MyManagerPage/MyManagerPage", () => () => (
  <div data-testid="MyManagerPage">MyManagerPage</div>
));

// Manager routes
jest.mock("./pagesManager/OverviewPageManager/OverviewPageManager", () => () => (
  <div data-testid="OverviewPageManager">OverviewPageManager</div>
));
jest.mock("./pagesManager/AllSongsPageManager/AllSongsPageManager", () => () => (
  <div data-testid="AllSongsPageManager">AllSongsPageManager</div>
));
jest.mock("./pagesManager/ManagerArtistsPage/ManagerArtistsPage", () => () => (
  <div data-testid="ManagerArtistsPage">ManagerArtistsPage</div>
));
jest.mock("./pagesManager/ManArtistTransPage/ManArtistTransPage", () => () => (
  <div data-testid="ManArtistTransPage">ManArtistTransPage</div>
));
jest.mock("./pagesManager/ManagerTransPage/ManagerTransPage", () => () => (
  <div data-testid="ManagerTransPage">ManagerTransPage</div>
));
jest.mock("./components/componentsManager/TopArtistsRevenue/TopArtistsRevenue", () => () => (
  <div data-testid="TopArtistsRevenue">TopArtistsRevenue</div>
));
jest.mock("./pagesManager/ManagerRequestsPage/ManagerRequestsPage", () => () => (
  <div data-testid="ManagerRequestsPage">ManagerRequestsPage</div>
));

// Common components
jest.mock("./components/common/Sidebar/Sidebar", () => () => (
  <div data-testid="Sidebar">Sidebar</div>
));
jest.mock("./components/common/Profile/ProfilePage", () => () => (
  <div data-testid="ProfilePage">ProfilePage</div>
));

describe("App Routing", () => {
  beforeEach(() => {
    // Reset authentication mock between tests
    ApiService.isAuthenticated.mockClear();
  });

  // Auth Routes
  it('renders LandingPage at route "/"', () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("LandingPage")).toBeInTheDocument();
  });

  it('renders Home at route "/home"', () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("Home")).toBeInTheDocument();
  });

  it('renders LoginPage at route "/login"', () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("LoginPage")).toBeInTheDocument();
  });

  it('renders ChangePassword at route "/change-password"', () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    render(
      <MemoryRouter initialEntries={["/change-password"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("ChangePassword")).toBeInTheDocument();
  });

  it('renders ForgotPassword at route "/forgot-password"', () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("ForgotPassword")).toBeInTheDocument();
  });

  it('renders ContactForm at route "/contact-form"', () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    render(
      <MemoryRouter initialEntries={["/contact-form"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("ContactForm")).toBeInTheDocument();
  });

  it('renders UpdateProfilePage at route "/update-profile"', () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    render(
      <MemoryRouter initialEntries={["/update-profile"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("UpdateProfilePage")).toBeInTheDocument();
  });

  // Admin Routes
  it('renders OverviewPageAdmin at route "/admin-dashboard"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/admin-dashboard"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("OverviewPageAdmin")).toBeInTheDocument();
  });

  it('renders UsersPage at route "/all-users"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/all-users"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("UsersPage")).toBeInTheDocument();
  });

  it('renders AllTransPage at route "/all-transactions"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/all-transactions"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("AllTransPage")).toBeInTheDocument();
  });

  it('renders AllSongsPage at route "/all-songs"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/all-songs"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("AllSongsPage")).toBeInTheDocument();
  });

  it('renders AddUsers at route "/add-user"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/add-user"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("AddUsers")).toBeInTheDocument();
  });

  it('renders RoyaltiesPage at route "/royalties"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/royalties"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("RoyaltiesPage")).toBeInTheDocument();
  });

  it('renders ContactRequestsPage at route "/contact-requests"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/contact-requests"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("ContactRequestsPage")).toBeInTheDocument();
  });

  // Artist Routes
  it('renders OverviewPageArtist at route "/artist-dashboard"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/artist-dashboard"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("OverviewPageArtist")).toBeInTheDocument();
  });

  it('renders ArtistSongsPage at route "/artist-songs"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/artist-songs"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("ArtistSongsPage")).toBeInTheDocument();
  });

  it('renders AllSongsPageArtist at route "/all-artist-songs"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/all-artist-songs"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("AllSongsPageArtist")).toBeInTheDocument();
  });

  it('renders AddSong at route "/add-song"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/add-song"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("AddSong")).toBeInTheDocument();
  });

  it('renders ArtistTrans at route "/transaction-history"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/transaction-history"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("ArtistTrans")).toBeInTheDocument();
  });

  it('renders ArtistRequestsPage at route "/artist-requests"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/artist-requests"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("ArtistRequestsPage")).toBeInTheDocument();
  });

  it('renders MyManagerPage at route "/my-manager-details"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/my-manager-details"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("MyManagerPage")).toBeInTheDocument();
  });

  // Manager Routes
  it('renders OverviewPageManager at route "/manager-dashboard"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/manager-dashboard"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("OverviewPageManager")).toBeInTheDocument();
  });

  it('renders AllSongsPageManager at route "/all-msongs"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/all-msongs"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("AllSongsPageManager")).toBeInTheDocument();
  });

  it('renders ManagerArtistsPage at route "/manager-artists"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/manager-artists"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("ManagerArtistsPage")).toBeInTheDocument();
  });

  it('renders ManArtistTransPage at route "/man-artist-trans"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/man-artist-trans"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("ManArtistTransPage")).toBeInTheDocument();
  });

  it('renders ManagerTransPage at route "/manager-transactions"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/manager-transactions"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("ManagerTransPage")).toBeInTheDocument();
  });

  it('renders TopArtistsRevenue at route "/top-artist-evenue"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/top-artist-evenue"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("TopArtistsRevenue")).toBeInTheDocument();
  });

  it('renders ManagerRequestsPage at route "/manager-requests"', () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/manager-requests"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("ManagerRequestsPage")).toBeInTheDocument();
  });

  // Sidebar tests
  it("renders Sidebar when the user is authenticated and not on an auth page", () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/artist-dashboard"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("Sidebar")).toBeInTheDocument();
  });

  it("does not render Sidebar on auth pages even if the user is authenticated", () => {
    ApiService.isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.queryByTestId("Sidebar")).not.toBeInTheDocument();
  });

  // Test for unknown route redirection (should redirect to LandingPage)
  it('redirects unknown routes to "/"', () => {
    ApiService.isAuthenticated.mockReturnValue(false);
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("LandingPage")).toBeInTheDocument();
  });
});
