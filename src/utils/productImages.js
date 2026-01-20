import sinAditivo from '../../acces/sin aditivo.png';
import citrato from '../../acces/citrato.png';
import heparina from '../../acces/heparina.png';
import esr from '../../acces/esr.png';
import edta from '../../acces/edta.png';
import activador from '../../acces/activador.png';
import glucosa from '../../acces/glucosa.png';
import orina from '../../acces/orina.png';
import tiras from '../../acces/tiras.png';
import pipetas from '../../acces/pipetas.png';
import guantes from '../../acces/guantes.png';
import centrifuga from '../../acces/centrifuga.png';
import analizador from '../../acces/analizador.png';

export const productImages = {
  sinAditivo,
  citrato,
  heparina,
  esr,
  edta,
  activador,
  glucosa,
  orina,
  tiras,
  pipetas,
  guantes,
  centrifuga,
  analizador
};

export const resolveProductImage = (product) => {
  if (product?.image) return product.image;
  if (product?.imageKey && productImages[product.imageKey]) {
    return productImages[product.imageKey];
  }
  return '';
};
