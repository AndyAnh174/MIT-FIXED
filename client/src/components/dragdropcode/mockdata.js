export const mockData = [
  {
    id: 1,
    content: `#include <iostream>\nusing namespace std;\n\nint main(){`,
  },
  {
    id: 2,
    content: `int N;\ncout << "Moi nhap N: ";\ncin >> N;\nint dem;`,
  },
  {
    id: 3,
    content: `for(int i = 2; i <= N; i++){\n\tdem = 0;\n\twhile(N % i == 0){\n\t\t++dem;`,
  },
  {
    id: 4,
    content: `\t\tN /= i;\n\t}\n\tif(dem){\n\t\tcout << i;`,
  },
  {
    id: 5,
    content: `\t\tif(dem > 1) cout << "^" << dem;\n\t\tif(N > i){\n\t\t\tcout << " * ";\n\t}`,
  },
  {
    id: 6,
    content: `}\n}\nreturn 0;\n}`,
  },
];
