# CSS Import Guide for React Components

## How to Connect CSS Files with JSX Components

In this React + Vite project, CSS files are connected to JSX components using ES6 import syntax.

### Correct Pattern

**Step 1:** Create your CSS file in the same directory as your component
```
src/components/
  ├── Favorites.jsx
  └── Favorites.css
```

**Step 2:** Import the CSS file at the top of your JSX file
```javascript
import './Favorites.css'  // Relative path to CSS file

function Favorites() {
  return (
    <div className="favorites-container">
      {/* Your component JSX */}
    </div>
  )
}

export default Favorites
```

### Key Points

1. **Use ES6 import syntax**: `import './ComponentName.css'`
2. **Relative path**: Use `./` for files in the same directory
3. **Place import at the top**: CSS imports should be at the top of the file, before the component definition
4. **File extension required**: Always include `.css` extension
5. **Vite bundles automatically**: Vite will automatically bundle the CSS with your JavaScript

### Example: Favorites Component

**Favorites.jsx**
```javascript
import './Favorites.css'

function Favorites() {
  return (
    <div className="favorites-container">
      <h2 className="favorites-title">My Favorite Movies</h2>
      {/* Component content */}
    </div>
  )
}

export default Favorites
```

**Favorites.css**
```css
.favorites-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.favorites-title {
  font-size: 2.5rem;
  color: #333;
  text-align: center;
}
```

### Common Mistakes to Avoid

❌ **Wrong**: Using require() syntax
```javascript
require('./Favorites.css')  // Don't use this
```

❌ **Wrong**: Missing file extension
```javascript
import './Favorites'  // Missing .css extension
```

❌ **Wrong**: Wrong path
```javascript
import 'Favorites.css'  // Missing ./ for relative path
```

✅ **Correct**: ES6 import with relative path and extension
```javascript
import './Favorites.css'
```

### Verification

After importing your CSS, you can verify it's working by:

1. **Build the project**: `npm run build` - CSS will be bundled into dist/assets/
2. **Run dev server**: `npm run dev` - Hot reload will show CSS changes immediately
3. **Check browser**: Inspect element to see if styles are applied

### Additional Resources

- [Vite CSS Documentation](https://vitejs.dev/guide/features.html#css)
- [React Styling Documentation](https://react.dev/learn/styling)
