# Component rules

1. `layout/` composes the shared publication shell: Header, Footer, SiteChrome, and theme controls.
2. `labs/` contains shared Lab interface pieces and state messaging.
3. `experience/` contains reusable learning primitives such as source drawers.
4. `sketch/` is limited to optional code-native 2D canvas work that is not part of the Lab runtime.
5. `typography/` contains editorial primitives.

Components are server components unless they require browser state, event handlers, or local persistence. Client boundaries stay narrow. Controls use semantic HTML, visible focus, 44px minimum targets, and explicit labels. Important explanations cannot exist only inside a canvas or hover state.

The shared Lab shell labels observations, assumptions, source claims, Austrian interpretations, and credible counterarguments distinctly. It presents deterministic checklist results without scores or semantic-grading language.
