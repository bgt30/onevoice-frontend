## Architecture

```mermaid
graph TD
    User(("User"))
    DOM["DOM"]
    
    subgraph "Next.js Application"
        App[App Component]
        Layout[Layout Component]
        
        subgraph "Pages"
            LoginPage[Login Page]
            SignupPage[Signup Page]
            ProfilePage[Profile Page]
            DashboardPage[Dashboard Page]
            VideoDetailPage[Video Detail Page]
        end
        
        subgraph "UI Components"
            Button[Button]
            Dialog[Dialog]
            Badge[Badge]
            ProgressBar[Progress Bar]
            Toast[Toast Notification]
        end
        
        subgraph "Context Providers"
            AuthContext[Auth Context]
            AppProviders[App Providers]
        end
        
        subgraph "Services"
            AuthService[Auth Service]
            UserService[User Service]
            VideoService[Video Service]
            BillingService[Billing Service]
        end
        
        subgraph "Hooks"
            UseUser[useUser]
            UseVideos[useVideos]
            UseRealtimeUpdates[useRealtimeUpdates]
        end
        
        subgraph "Utilities"
            HttpClient[HTTP Client]
            WebSocketManager[WebSocket Manager]
            MockData[Mock Data]
        end
        
        ErrorBoundary[Error Boundary]
    end
    
    User -->|interacts with| DOM
    DOM -->|renders| App
    App --> Layout
    App --> AppProviders
    App --> AuthContext
    App --> ErrorBoundary
    App --> WebSocketManager
    
    Layout --> LoginPage
    Layout --> SignupPage
    Layout --> ProfilePage
    Layout --> DashboardPage
    Layout --> VideoDetailPage
    
    DashboardPage --> Button
    DashboardPage --> ProgressBar
    ProfilePage --> Badge
    VideoDetailPage --> Dialog
    VideoDetailPage --> Toast
    
    AppProviders --> AuthContext
    AppProviders --> UseUser
    AppProviders --> UseVideos
    AppProviders --> UseRealtimeUpdates
    
    UseUser --> AuthService
    UseVideos --> VideoService
    UseRealtimeUpdates --> WebSocketManager
    
    AuthService -->|fetches| User
    VideoService -->|fetches| Video
    WebSocketManager -->|manages| UseRealtimeUpdates
    
    ErrorBoundary -.->|catches| User
    ErrorBoundary -.->|displays| Toast
    
    %% Data Flow
    User -->|logs in| AuthService
    User -->|uploads video| VideoService
    User -->|updates profile| UserService
    User -->|initiates dubbing| VideoService
    WebSocketManager -->|receives updates| UseRealtimeUpdates
    UseRealtimeUpdates -->|updates UI| DashboardPage
    UseRealtimeUpdates -->|displays notifications| Toast
    
    %% Error Handling
    ErrorBoundary -->|catches errors| User
    ErrorBoundary -->|shows fallback UI| DOM
    ```