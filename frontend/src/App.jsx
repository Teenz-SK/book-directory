import { useEffect, useState } from 'react';
import { api } from './api';
import './index.css';

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', category: '', publishedYear: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchBooks = async () => {
    const res = await api.get('/books');
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    let res;
    if (editingId) {
      res = await api.put(`/books/${editingId}`, form);
    } else {
      res = await api.post('/books', form);
    }
    alert(res.data.message);
    setForm({ title: '', author: '', category: '', publishedYear: '' });
    setEditingId(null);
    fetchBooks();
  };

  const handleEdit = (book) => {
    setForm(book);
    setEditingId(book._id);
  };

  const handleDelete = async (id) => {
    const res = await api.delete(`/books/${id}`);
    alert(res.data.message);
    fetchBooks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-blue-700 text-center mb-10">📖 Book Directory</h1>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
        >
          {['title', 'author', 'category', 'publishedYear'].map((field) => (
            <input
              key={field}
              type={field === 'publishedYear' ? 'number' : 'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              required
              className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          ))}
          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            {editingId ? 'Update Book' : 'Add Book'}
          </button>
        </form>

        {/* Book List */}
        <div className="space-y-4">
          {books.length === 0 ? (
            <p className="text-center text-gray-500">No books found. Add your first book!</p>
          ) : (
            books.map((book) => (
              <div
                key={book._id}
                className="flex justify-between items-center bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm"
              >
                <div>
                  <h2 className="text-lg font-bold text-blue-800">{book.title}</h2>
                  <p className="text-sm text-gray-700">
                    {book.author} &bull; {book.category} &bull; {book.publishedYear}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="px-4 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
