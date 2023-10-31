import { useEffect } from "react";
import { Effect, pipe } from "effect";
import "./App.css";

const fetchUser = (id: string) =>
  Effect.tryPromise({
    try: () => fetch(`https://jsonplaceholder.typicode.com/users/${id}`),
    catch: () => "fetch" as const,
  });

const getJson = (res: Response) =>
  Effect.tryPromise({
    try: () => res.json() as Promise<unknown>, // Promise<any> otherwise
    catch: () => "json" as const,
  });

const getAndParseGist = pipe(
  // Effect.Effect<never, 'fetch', Response>
  fetchUser("1"),

  // Effect.Effect<never, 'fetch' | 'json', unknown>
  Effect.flatMap(getJson)

  // Effect.Effect<never, 'fetch' | 'json' | DecodeError, Gist>
  //Effect.flatMap(parseEither(GistSchema))
);

function App() {
  useEffect(() => {
    Effect.runPromise(getAndParseGist)
      .then((x) => console.log("decoded gist %o", x))
      .catch((err) => console.error(err));
  }, []);
  return <div>Hello, Effect!</div>;
}

export default App;
