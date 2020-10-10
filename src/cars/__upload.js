// SUSPECT UNUSED
// https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa
// https://medium.com/@mahesh_joshi/reactjs-nodejs-upload-image-how-to-upload-image-using-reactjs-and-nodejs-multer-918dc66d304c
const React = require('react')
class Upload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    if (this.state.file !== null)
      URL.revokeObjectURL(this.state.file);

    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleChange} />
        <img src={this.state.file} width="400px" />
      </div>
    );
  }
}
module.exports = Upload