import { fromJS, Map } from 'immutable';

export const COLORS = fromJS([
  { id: 0, title: 'Film & Animation', categoryId: '1', color: '#0048BA' },
  { id: 1, title: 'Autos & Vehicles', categoryId: '2', color: '#4C2F27' },
  { id: 2, title: 'Music', categoryId: '10', color: '#B0BF1A' },
  { id: 3, title: 'Pets & Animals', categoryId: '3', color: '#7CB9E8' },
  { id: 4, title: 'Sports', categoryId: '17', color: '#C9FFE5' },
  { id: 5, title: 'Short Movies', categoryId: '18', color: '#B284BE' },
  { id: 6, title: 'Travel & Events', categoryId: '19', color: '#5D8AA8' },
  { id: 7, title: 'Gaming', categoryId: '20', color: '#00308F' },
  { id: 8, title: 'Videoblogging', categoryId: '21', color: '#72A0C1' },
  { id: 9, title: 'People & Blogs', categoryId: '22', color: '#AF002A' },
  { id: 10, title: 'Comedy', categoryId: '23', color: '#F2F0E6' },
  { id: 11, title: 'Entertainment', categoryId: '24', color: '#F0F8FF' },
  { id: 12, title: 'News & Politics', categoryId: '25', color: '#E32636' },
  { id: 13, title: 'Howto & Style', categoryId: '26', color: '#C46210' },
  { id: 14, title: 'Education', categoryId: '27', color: '#EFDECD' },
  { id: 15, title: 'Science & Technology', categoryId: '28', color: '#D6D6D6' },
  { id: 16, title: 'Movies', categoryId: '30', color: '#D2D9DB' },
  { id: 17, title: 'Anime/Animation', categoryId: '31', color: '#E52B50' },
  { id: 18, title: 'Action/Adventure', categoryId: '32', color: '#9F2B68' },
  { id: 19, title: 'Classics', categoryId: '33', color: '#F19CBB' },
  { id: 20, title: 'Comedy', categoryId: '34', color: '#AB274F' },
  { id: 21, title: 'Documentary', categoryId: '35', color: '#D3212D' },
  { id: 22, title: 'Drama', categoryId: '36', color: '#3B7A57' },
  { id: 23, title: 'Family', categoryId: '37', color: '#FFBF00' },
  { id: 24, title: 'Foreign', categoryId: '38', color: '#3B3B6D' },
  { id: 25, title: 'Horror', categoryId: '39', color: '#391802' },
  { id: 26, title: 'Sci-Fi/Fantasy', categoryId: '40', color: '#804040' },
  { id: 27, title: 'Thriller', categoryId: '41', color: '#D3AF37' },
  { id: 28, title: 'Shorts', categoryId: '42', color: '#34B334' },
  { id: 29, title: 'Shows', categoryId: '43', color: '#FF8B00' },
  { id: 30, title: 'Trailers', categoryId: '44', color: '#FF9899' },
]);

export function getColorForId(id) {
  return COLORS.find((col) => col.get('id') === id, null, Map()).get('color');
}
