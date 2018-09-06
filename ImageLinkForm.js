import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange,onButtonSubmit}) => {
	/*feeds the state into the component ImageLinkForm*/
	return (
		<div>
			<p className='f3'>
				{'This Magic Brain Will Detect Faces'}
			</p>
			<div className='center'>
				<div className='form center pa4 br3 shadow-5'>
					<input className='f4 pa2 w-70 center' type='text' 
					onChange={onInputChange}/>
				{/*changes the input to whatever onInputChange is;
				"onchange" is a specific attribute in HTML*/}
					<button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
					onClick={onButtonSubmit}
					>Detect</button>
				</div>
			</div>
		</div>
	);
}

export default ImageLinkForm;