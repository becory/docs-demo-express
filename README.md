# docs-demo-express

- UI: [Github](https://github.com/becory/docs-demo-ui/)
- API: [Github](https://github.com/becory/docs-demo-express/)

## Technical

### UI
1. React Hook
2. React Router Dom
3. Tailwinds (SCSS)
4. QuillJS (Editor)

Deploy on [Heroku](https://mydocs-demo.herokuapp.com/)

### API
1. Express
2. Sequelize
3. PostgresSQL
4. Socket.io

Deploy on [github-pages](https://becory.github.io/docs-demo-ui/)

User story
---

```gherkin=
Feature: Users can collaborate each other.

  Scenario: User create or open document.
    When the user create or open document.
    Then Those user who opened the document will track and sync the cursor, selection and document change.

  Scenario: The creator can set the document who can read or edit it.
    Given The creator can set a authorization list for a document.
    When The User on the authorization list.
    Then He/She can be edit or read only the document.
```

User Flow
---
[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVEJcbiAgc3ViZ3JhcGggXCJEb2N1bWVudFwiXG4gIE9wZW5bT3BlbiBEb2N1bWVudF1cbiAgZW5kXG5cbiAgc3ViZ3JhcGggXCJEb2N1bWVudCBMaXN0IFBhZ2VcIlxuICBEb2NMaXN0Rmxvd1tEb2N1bWVudCBMaXN0XVxuICBEb2NMaXN0RmxvdyAtLT4gQ3JlYXRlW0NyZWF0ZSBEb2N1bWVudF1cbiAgRG9jTGlzdEZsb3cgLS0-IFF1ZXJ5W1F1ZXJ5IExvZ2luIFVzZXIncyBEb2N1bWVudF1cbiAgQ3JlYXRlIC0tPiBPcGVuXG4gIFF1ZXJ5IC0tPiBPcGVuXG4gIGVuZFxuXG4gIHN1YmdyYXBoIFwiTG9naW4gUGFnZVwiXG4gIFN0YXJ0KHN0YXJ0KVxuICBTdGFydCAtLT4gTG9naW5cbiAgU3RhcnQgLS0-IFJlZ2lzdGVyXG4gIFJlZ2lzdGVyIC0tPiByZWdpc3RlckZvcm1bL1JlZ2lzdGVyIEZvcm0vXVxuICByZWdpc3RlckZvcm0gLS0-IHJlZ2lzdGVyT0t7SXMgc3VjY2Vzcz99XG4gIHJlZ2lzdGVyT0sgLS0gWWVzIC0tPiBMb2dpblxuICByZWdpc3Rlck9LIC0tIE5vIC0tPiBSZWdpc3RlclxuICBMb2dpbiAtLT4gbG9naW5Gb3JtWy9maWxsIFVzZXJuYW1lLCBQYXNzd29yZC9dXG4gIGxvZ2luRm9ybSAtLT4gbG9naW57aXMgTG9naW4_fVxuICBsb2dpbiAtLSBZZXMgLS0-IERvY0xpc3RGbG93W0RvY3VtZW50IExpc3RdXG4gIGxvZ2luIC0tIE5vIC0tPiBTdGFydFxuZW5kIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/edit#eyJjb2RlIjoiZ3JhcGggVEJcbiAgc3ViZ3JhcGggXCJEb2N1bWVudFwiXG4gIE9wZW5bT3BlbiBEb2N1bWVudF1cbiAgZW5kXG5cbiAgc3ViZ3JhcGggXCJEb2N1bWVudCBMaXN0IFBhZ2VcIlxuICBEb2NMaXN0Rmxvd1tEb2N1bWVudCBMaXN0XVxuICBEb2NMaXN0RmxvdyAtLT4gQ3JlYXRlW0NyZWF0ZSBEb2N1bWVudF1cbiAgRG9jTGlzdEZsb3cgLS0-IFF1ZXJ5W1F1ZXJ5IExvZ2luIFVzZXIncyBEb2N1bWVudF1cbiAgQ3JlYXRlIC0tPiBPcGVuXG4gIFF1ZXJ5IC0tPiBPcGVuXG4gIGVuZFxuXG4gIHN1YmdyYXBoIFwiTG9naW4gUGFnZVwiXG4gIFN0YXJ0KHN0YXJ0KVxuICBTdGFydCAtLT4gTG9naW5cbiAgU3RhcnQgLS0-IFJlZ2lzdGVyXG4gIFJlZ2lzdGVyIC0tPiByZWdpc3RlckZvcm1bL1JlZ2lzdGVyIEZvcm0vXVxuICByZWdpc3RlckZvcm0gLS0-IHJlZ2lzdGVyT0t7SXMgc3VjY2Vzcz99XG4gIHJlZ2lzdGVyT0sgLS0gWWVzIC0tPiBMb2dpblxuICByZWdpc3Rlck9LIC0tIE5vIC0tPiBSZWdpc3RlclxuICBMb2dpbiAtLT4gbG9naW5Gb3JtWy9maWxsIFVzZXJuYW1lLCBQYXNzd29yZC9dXG4gIGxvZ2luRm9ybSAtLT4gbG9naW57aXMgTG9naW4_fVxuICBsb2dpbiAtLSBZZXMgLS0-IERvY0xpc3RGbG93W0RvY3VtZW50IExpc3RdXG4gIGxvZ2luIC0tIE5vIC0tPiBTdGFydFxuZW5kIiwibWVybWFpZCI6IntcbiAgXCJ0aGVtZVwiOiBcImRlZmF1bHRcIlxufSIsInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)

## Data Schema
![Data schema](https://i.imgur.com/u4iPBWB.png)
